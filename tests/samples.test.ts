import { describe, expect, it } from "vitest";
import { SAMPLE_DOCUMENTS, SAMPLE_RENT_AGREEMENT, SAMPLE_EMPLOYMENT_CONTRACT, SAMPLE_LEGAL_NOTICE_138, SAMPLE_LOAN_AGREEMENT, SAMPLE_CONSUMER_WARRANTY } from "@/lib/samples";
import { MAX_DOCUMENT_CHARS } from "@/lib/schema";

describe("sample documents suite", () => {
  it("provides 5 distinct multi-domain samples", () => {
    expect(SAMPLE_DOCUMENTS).toHaveLength(5);
  });

  it("ensures all samples are within valid length boundaries", () => {
    for (const sample of SAMPLE_DOCUMENTS) {
      expect(sample.text.length).toBeGreaterThanOrEqual(40);
      expect(sample.text.length).toBeLessThanOrEqual(MAX_DOCUMENT_CHARS);
    }
  });

  it("contains localized titles and descriptions for all supported languages", () => {
    for (const sample of SAMPLE_DOCUMENTS) {
      expect(sample.title.en).toBeTruthy();
      expect(sample.title.hi).toBeTruthy();
      expect(sample.title.bn).toBeTruthy();

      expect(sample.description.en).toBeTruthy();
      expect(sample.description.hi).toBeTruthy();
      expect(sample.description.bn).toBeTruthy();
    }
  });

  it("verifies rent sample contains tenancy dispute markers", () => {
    expect(SAMPLE_RENT_AGREEMENT).toContain("SECURITY DEPOSIT");
    expect(SAMPLE_RENT_AGREEMENT).toContain("Rs. 1,80,000");
  });

  it("verifies employment sample contains non-compete and bond clauses", () => {
    expect(SAMPLE_EMPLOYMENT_CONTRACT).toContain("POST-EMPLOYMENT NON-COMPETE");
    expect(SAMPLE_EMPLOYMENT_CONTRACT).toContain("Rs. 3,50,000");
    expect(SAMPLE_EMPLOYMENT_CONTRACT).toContain("MANDATORY SERVICE BOND");
  });

  it("verifies cheque notice sample contains Section 138 statutory elements", () => {
    expect(SAMPLE_LEGAL_NOTICE_138).toContain("Section 138 of the Negotiable Instruments Act");
    expect(SAMPLE_LEGAL_NOTICE_138).toContain("Cheque Return Memo");
    expect(SAMPLE_LEGAL_NOTICE_138).toContain("fifteen (15) days");
  });

  it("verifies loan sample contains consumer interest and contact access terms", () => {
    expect(SAMPLE_LOAN_AGREEMENT).toContain("UNILATERAL INTEREST MODIFICATION");
    expect(SAMPLE_LOAN_AGREEMENT).toContain("THIRD-PARTY CONTACT & DATA ACCESS");
  });

  it("verifies consumer warranty sample contains defect and waiver terms", () => {
    expect(SAMPLE_CONSUMER_WARRANTY).toContain("SEVEN-DAY REPLACEMENT BAR");
    expect(SAMPLE_CONSUMER_WARRANTY).toContain("Consumer Protection Act, 2019");
  });
});
