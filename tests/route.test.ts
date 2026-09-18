import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/analyze/route";
import { resetRateLimiter } from "@/lib/ratelimit";
import * as gemini from "@/lib/gemini";
import type { ModelOutput } from "@/lib/schema";

vi.mock("@/lib/gemini", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/gemini")>();
  return {
    ...actual,
    analyzeDocument: vi.fn(),
  };
});

beforeEach(() => {
  resetRateLimiter();
  vi.clearAllMocks();
});

const VALID_SAMPLE_TEXT = `LEAVE AND LICENCE AGREEMENT
1. RENT: Rs. 15,000 per month.
2. DEPOSIT: Rs. 1,50,000 as security deposit.
3. FORFEITURE: The deposit shall be forfeited without showing any loss if vacated early.
4. DISPUTES: Licensee agrees never to approach consumer forum or court.`;

const MOCK_MODEL_OUTPUT: ModelOutput = {
  documentKind: "rent_agreement",
  summary: "This is a residential tenancy agreement containing several unconscionable clauses.",
  findings: [
    {
      clause: "The deposit shall be forfeited without showing any loss",
      verdict: "void",
      statuteId: "ica-1872-s74",
      explanation: "Penalty clauses without proof of actual loss are void under Indian Contract Act Section 74.",
      confidence: "high",
    },
    {
      clause: "Licensee agrees never to approach consumer forum or court",
      verdict: "void",
      statuteId: "ica-1872-s28",
      explanation: "Agreements barring legal proceedings are void under Section 28.",
      confidence: "high",
    },
  ],
  events: [
    {
      kind: "contract_breach",
      date: "2026-01-15",
      description: "Landlord failed to give possession",
    },
  ],
  questionsForALawyer: [
    "Can the landlord legally forfeit my deposit without proof of damage?",
    "How can I recover possession or get a refund of the advance paid?",
  ],
  inconsistencies: [
    {
      clauseA: "Rent is Rs. 15,000 per month",
      clauseB: "Forfeiture of entire Rs. 1,50,000 deposit on early exit",
      explanation: "Deposit forfeiture penalty contradicts standard notice exit.",
      severity: "high",
    },
  ],
  optionsAndNextSteps: [
    {
      category: "negotiation",
      title: "Demand Clause Strikeout",
      description: "Ask landlord to delete blanket forfeiture clause under ICA s. 74.",
      actionableStep: "Issue a written request stating Section 74 prohibits unproved penalties.",
    },
  ],
  actionableChecklist: [
    {
      id: "task-1",
      task: "Collect bank transfer receipt for Rs. 1,50,000",
      priority: "urgent",
      category: "Evidence",
    },
  ],
};

describe("POST /api/analyze", () => {
  it("returns 405 Method Not Allowed on GET request", async () => {
    const response = await GET();
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("returns 400 when body is not valid JSON", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ invalid json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("valid JSON");
  });

  it("returns 400 when document text is missing or too short", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Short text", language: "en" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("Paste at least a paragraph");
  });

  it("returns 400 when document text exceeds maximum character limit", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "A".repeat(65_000), language: "en" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("too long");
  });

  it("enforces rate limits after 6 requests per IP with 429", async () => {
    vi.mocked(gemini.analyzeDocument).mockResolvedValue(MOCK_MODEL_OUTPUT);

    const makeRequest = () =>
      new Request("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.50",
        },
        body: JSON.stringify({ text: VALID_SAMPLE_TEXT, language: "en" }),
      });

    for (let i = 0; i < 6; i++) {
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
    }

    const blocked = await POST(makeRequest());
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeDefined();
    const json = await blocked.json();
    expect(json.error).toContain("Too many requests");
  });

  it("returns 503 when GEMINI_API_KEY is missing (GeminiConfigError)", async () => {
    vi.mocked(gemini.analyzeDocument).mockRejectedValue(
      new gemini.GeminiConfigError("GEMINI_API_KEY is not set"),
    );

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: VALID_SAMPLE_TEXT, language: "en" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json.error).toContain("configured correctly");
  });

  it("returns 502 when Gemini call fails (GeminiCallError)", async () => {
    vi.mocked(gemini.analyzeDocument).mockRejectedValue(
      new gemini.GeminiCallError("Model timeout"),
    );

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: VALID_SAMPLE_TEXT, language: "en" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(502);
    const json = await response.json();
    expect(json.error).toContain("could not finish reading");
  });

  it("successfully analyzes document and returns grounded findings and deadlines", async () => {
    vi.mocked(gemini.analyzeDocument).mockResolvedValue(MOCK_MODEL_OUTPUT);

    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: VALID_SAMPLE_TEXT,
        language: "en",
        today: "2026-02-01",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();

    expect(json.documentKind).toBe("rent_agreement");
    expect(json.summary).toBe(MOCK_MODEL_OUTPUT.summary);
    expect(json.findings).toHaveLength(2);
    expect(json.findings[0].statute.id).toBe("ica-1872-s74");
    expect(json.deadlines.length).toBeGreaterThan(0);
    expect(json.questionsForALawyer).toEqual(MOCK_MODEL_OUTPUT.questionsForALawyer);
    expect(json.ungroundedClaimsDiscarded).toBe(0);
    expect(Array.isArray(json.inconsistencies)).toBe(true);
    expect(Array.isArray(json.optionsAndNextSteps)).toBe(true);
    expect(Array.isArray(json.actionableChecklist)).toBe(true);
  });
});
