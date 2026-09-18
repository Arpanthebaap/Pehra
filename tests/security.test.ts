import { describe, expect, it } from "vitest";
import { POST as analyzePost } from "@/app/api/analyze/route";
import { POST as comparePost } from "@/app/api/compare/route";
import { POST as askPost } from "@/app/api/ask/route";

describe("Security & Adversarial Defenses", () => {
  it("sanitizes null bytes and control characters from document text", async () => {
    const dirtyText = "Agreement with \u0000null bytes\u0007 and \u001Fcontrol characters that has enough length to qualify.";
    const req = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: dirtyText,
        language: "en",
      }),
    });

    // It should proceed past sanitization (may fail at gemini key if unconfigured, but not with 400 for control chars)
    const res = await analyzePost(req);
    expect(res.status).not.toBe(400);
  });

  it("blocks cross-site requests across all endpoints via Sec-Fetch-Site", async () => {
    const endpoints = [
      {
        post: analyzePost,
        url: "http://localhost:3000/api/analyze",
        body: { text: "This is long enough text to pass validation testing.", language: "en" },
      },
      {
        post: comparePost,
        url: "http://localhost:3000/api/compare",
        body: {
          originalText: "Original text that is long enough to meet requirements.",
          modifiedText: "Modified text that is long enough to meet requirements.",
        },
      },
      {
        post: askPost,
        url: "http://localhost:3000/api/ask",
        body: {
          documentText: "Document text that is long enough to meet requirements.",
          question: "Can they forfeit my deposit?",
        },
      },
    ];

    for (const ep of endpoints) {
      const req = new Request(ep.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "sec-fetch-site": "cross-site",
        },
        body: JSON.stringify(ep.body),
      });

      const res = await ep.post(req);
      expect(res.status).toBe(403);
      const data = (await res.json()) as { error: string };
      expect(data.error).toContain("Cross-site");
    }
  });

  it("rejects oversized payloads (>100KB on analyze)", async () => {
    const req = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "content-length": "150000",
      },
      body: JSON.stringify({ text: "a".repeat(150000) }),
    });

    const res = await analyzePost(req);
    expect(res.status).toBe(413);
  });

  it("rejects oversized payloads (>200KB on compare)", async () => {
    const req = new Request("http://localhost:3000/api/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "content-length": "250000",
      },
      body: JSON.stringify({
        originalText: "a".repeat(125000),
        modifiedText: "b".repeat(125000),
      }),
    });

    const res = await comparePost(req);
    expect(res.status).toBe(413);
  });

  it("rejects oversized payloads (>150KB on ask)", async () => {
    const req = new Request("http://localhost:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "content-length": "160000",
      },
      body: JSON.stringify({
        documentText: "a".repeat(150000),
        question: "Can they do this?",
      }),
    });

    const res = await askPost(req);
    expect(res.status).toBe(413);
  });
});
