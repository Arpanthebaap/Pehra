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

  it("masks Indian Voter ID (EPIC)", () => {
    expect(redact("Voter ID: ABC1234567").text).toBe("Voter ID: [VOTER ID REDACTED]");
  });

  it("masks Indian Passport numbers", () => {
    expect(redact("Passport No: J1234567").text).toBe("Passport No: [PASSPORT REDACTED]");
  });

  it("masks Bank IFSC codes", () => {
    expect(redact("IFSC: SBIN0001234").text).toBe("IFSC: [IFSC REDACTED]");
  });

  it("masks UPI IDs / VPAs", () => {
    expect(redact("Pay to rahul.kumar@okhdfcbank or merchant@paytm").text).toBe(
      "Pay to [UPI REDACTED] or [UPI REDACTED]",
    );
  });

  it("masks Indian Vehicle Registration numbers", () => {
    expect(redact("Vehicle DL-01-AB-1234 and MH12CD5678").text).toBe(
      "Vehicle [VEHICLE REG REDACTED] and [VEHICLE REG REDACTED]",
    );
  });

  it("is a no-op on empty input", () => {
    expect(redact("")).toEqual({ text: "", redactions: [] });
  });
});
