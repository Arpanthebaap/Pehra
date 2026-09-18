import { describe, expect, it } from "vitest";
import { POST, GET } from "@/app/api/ask/route";

describe("POST /api/ask route", () => {
  it("rejects GET requests with 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("POST");
  });

  it("rejects cross-site requests with 403 Forbidden", async () => {
    const req = new Request("http://localhost:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sec-fetch-site": "cross-site",
      },
      body: JSON.stringify({
        documentText: "Valid document text that has at least 30 characters in it.",
        question: "Can they forfeit my deposit?",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("Cross-site");
  });

  it("rejects questions shorter than 5 characters with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentText: "Valid document text that has at least 30 characters in it.",
        question: "Why?",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects document text shorter than 30 characters with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentText: "Too short",
        question: "Can they forfeit my deposit?",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid json",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("JSON");
  });
});
