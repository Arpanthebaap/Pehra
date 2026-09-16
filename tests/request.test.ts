import { describe, expect, it } from "vitest";
import { analyzeRequestSchema, MAX_DOCUMENT_CHARS } from "@/lib/schema";

const valid = { text: "x".repeat(200), language: "en" as const };

describe("analyzeRequestSchema", () => {
  it("accepts a well-formed request", () => {
    expect(analyzeRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("defaults to English when no language is given", () => {
    const parsed = analyzeRequestSchema.parse({ text: valid.text });
    expect(parsed.language).toBe("en");
  });

  it("rejects text too short to be a document", () => {
    expect(analyzeRequestSchema.safeParse({ text: "help" }).success).toBe(false);
  });

  it("rejects oversized input rather than paying to process it", () => {
    const result = analyzeRequestSchema.safeParse({
      text: "x".repeat(MAX_DOCUMENT_CHARS + 1),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported language instead of silently falling back", () => {
    expect(
      analyzeRequestSchema.safeParse({ ...valid, language: "fr" }).success,
    ).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(
      analyzeRequestSchema.safeParse({ ...valid, today: "16/09/2026" }).success,
    ).toBe(false);
  });

  it("rejects a non-string payload", () => {
    expect(analyzeRequestSchema.safeParse({ text: 42 }).success).toBe(false);
    expect(analyzeRequestSchema.safeParse(null).success).toBe(false);
  });
});
