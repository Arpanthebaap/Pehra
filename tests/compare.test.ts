import { describe, expect, it } from "vitest";
import { groundComparisonChanges, type ComparisonChangeInput } from "@/lib/compare";
import { POST, GET } from "@/app/api/compare/route";

describe("compareDocuments engine & grounding", () => {
  it("grounds valid statute citations and resolves plain language metadata", () => {
    const rawChanges: ComparisonChangeInput[] = [
      {
        category: "new_obligation",
        originalClause: null,
        modifiedClause: "Tenant must pay 10 months deposit.",
        verdict: "void",
        statuteId: "mta-2021-s11",
        explanation: "Model Tenancy Act caps residential deposit to two months.",
      },
      {
        category: "new_obligation",
        originalClause: null,
        modifiedClause: "2-year non-compete restraint.",
        verdict: "void",
        statuteId: "ica-1872-s27",
        explanation: "Indian Contract Act s. 27 voids restraint of trade covenants.",
      },
    ];

    const { grounded, discarded } = groundComparisonChanges(rawChanges, "en");
    expect(grounded).toHaveLength(2);
    expect(discarded).toBe(0);
    expect(grounded[0]?.statute.citation).toContain("Model Tenancy Act");
    expect(grounded[1]?.statute.citation).toContain("s. 27");
  });

  it("discards ungrounded or hallucinated statute citations", () => {
    const rawChanges: ComparisonChangeInput[] = [
      {
        category: "altered_term",
        originalClause: "Standard clause",
        modifiedClause: "Bad clause",
        verdict: "one_sided",
        statuteId: "hallucinated_imaginary_law_s99",
        explanation: "This should be dropped.",
      },
    ];

    const { grounded, discarded } = groundComparisonChanges(rawChanges, "en");
    expect(grounded).toHaveLength(0);
    expect(discarded).toBe(1);
  });
});

describe("POST /api/compare route", () => {
  it("rejects GET requests with 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("POST");
  });

  it("rejects cross-site requests with 403 Forbidden", async () => {
    const req = new Request("http://localhost:3000/api/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sec-fetch-site": "cross-site",
      },
      body: JSON.stringify({
        originalText: "Original text that is long enough to meet requirements.",
        modifiedText: "Modified text that is long enough to meet requirements.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("Cross-site");
  });

  it("rejects documents shorter than 30 characters with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalText: "Short",
        modifiedText: "Also short",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON body with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("JSON");
  });
});
