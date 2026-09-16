import { describe, expect, it } from "vitest";
import { redact } from "@/lib/redact";

describe("redact", () => {
  it("masks an Aadhaar number in any common spacing", () => {
    for (const value of ["4321 8765 2109", "4321-8765-2109", "432187652109"]) {
      const { text } = redact(`Aadhaar: ${value}`);
      expect(text).toContain("[AADHAAR REDACTED]");
      expect(text).not.toContain("8765");
    }
  });

  it("masks a PAN", () => {
    expect(redact("PAN ABCDE1234F").text).toBe("PAN [PAN REDACTED]");
  });

  it("masks Indian mobile numbers with and without the country code", () => {
    expect(redact("Call 9876543210").text).toContain("[PHONE REDACTED]");
    expect(redact("Call +91 9876543210").text).toContain("[PHONE REDACTED]");
  });

  it("masks email addresses", () => {
    expect(redact("write to a.b@example.co.in").text).toContain("[EMAIL REDACTED]");
  });

  it("masks long account numbers", () => {
    expect(redact("A/c 123456789012345").text).toContain("[ACCOUNT REDACTED]");
  });

  it("reports what it masked, and how many of each", () => {
    const { redactions } = redact("9876543210 and 9123456780");
    expect(redactions).toEqual([{ label: "Phone number", count: 2 }]);
  });

  it("leaves legal text untouched", () => {
    const clause = "Rs. 18,000 per month under section 74 of the Act, 1872.";
    expect(redact(clause).text).toBe(clause);
  });

  it("does not mistake a year or a rent figure for an identifier", () => {
    const { redactions } = redact("From 2026 the rent is 18000 per month.");
    expect(redactions).toHaveLength(0);
  });

  it("is a no-op on empty input", () => {
    expect(redact("")).toEqual({ text: "", redactions: [] });
  });
});
