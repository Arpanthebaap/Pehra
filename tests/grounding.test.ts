import { describe, expect, it } from "vitest";
import { groundFindings, type ModelFinding } from "@/lib/schema";
import { STATUTES, STATUTE_IDS, corpusBriefing, getStatute } from "@/lib/corpus/statutes";

const finding = (over: Partial<ModelFinding> = {}): ModelFinding => ({
  clause: "The entire deposit shall stand forfeited.",
  verdict: "void",
  statuteId: "ica-1872-s74",
  explanation: "A named penalty is a ceiling, not an entitlement.",
  confidence: "high",
  ...over,
});

describe("groundFindings - the guardrail", () => {
  it("keeps a finding that cites a real provision and attaches it", () => {
    const { findings, discarded } = groundFindings([finding()]);
    expect(discarded).toBe(0);
    expect(findings[0]?.statute.citation).toBe("Indian Contract Act, 1872, s. 74");
  });

  it("discards a finding that cites a provision which does not exist", () => {
    const { findings, discarded } = groundFindings([
      finding({ statuteId: "ica-1872-s999" }),
    ]);
    expect(findings).toHaveLength(0);
    expect(discarded).toBe(1);
  });

  it("discards a hallucinated citation even when it looks plausible", () => {
    const { discarded } = groundFindings([
      finding({ statuteId: "rent-control-act-1948-s14" }),
    ]);
    expect(discarded).toBe(1);
  });

  it("never lets an ungrounded claim through by verdict type", () => {
    const { findings } = groundFindings([
      finding({ verdict: "void", statuteId: "nope" }),
      finding({ verdict: "missing", statuteId: "nope" }),
      finding({ verdict: "one_sided", statuteId: "nope" }),
    ]);
    expect(findings).toHaveLength(0);
  });

  it("drops 'standard' findings, which make no legal claim to ground", () => {
    const { findings, discarded } = groundFindings([
      finding({ verdict: "standard", statuteId: "not-a-real-id" }),
    ]);
    expect(findings).toHaveLength(0);
    // Not counted as discarded: nothing was suppressed, it simply is not a claim.
    expect(discarded).toBe(0);
  });

  it("orders findings so void and missing are read first", () => {
    const { findings } = groundFindings([
      finding({ verdict: "one_sided", statuteId: "ica-1872-s16" }),
      finding({ verdict: "missing", statuteId: "mta-2021-s21" }),
      finding({ verdict: "void", statuteId: "ica-1872-s28" }),
    ]);
    expect(findings.map((f) => f.verdict)).toEqual(["void", "missing", "one_sided"]);
  });

  it("handles an empty response without throwing", () => {
    expect(groundFindings([])).toEqual({ findings: [], discarded: 0 });
  });
});

describe("corpus integrity", () => {
  it("has no duplicate ids", () => {
    expect(new Set(STATUTE_IDS).size).toBe(STATUTE_IDS.length);
  });

  it("gives every provision a citation, a plain reading and a consequence", () => {
    for (const statute of STATUTES) {
      expect(statute.citation.length).toBeGreaterThan(10);
      expect(statute.plain.length).toBeGreaterThan(40);
      expect(statute.soWhat.length).toBeGreaterThan(20);
      expect(statute.domains.length).toBeGreaterThan(0);
    }
  });

  it("resolves every id the prompt whitelist advertises", () => {
    for (const id of STATUTE_IDS) expect(getStatute(id)).toBeDefined();
  });

  it("lists every provision in the briefing handed to the model", () => {
    const briefing = corpusBriefing();
    for (const id of STATUTE_IDS) expect(briefing).toContain(id);
  });
});

describe("multilingual statute localization", () => {
  it("localizes statute titles, plain readings, and consequences into Hindi", () => {
    const statuteHi = getStatute("mta-2021-s11", "hi");
    expect(statuteHi).toBeDefined();
    expect(statuteHi?.citation).toContain("मॉडल");
    expect(statuteHi?.title).toContain("सुरक्षा जमा");
    expect(statuteHi?.plain).toContain("मॉडल टेनेंसी एक्ट");
    expect(statuteHi?.soWhat).toContain("मॉडल टेनेंसी एक्ट");
  });

  it("localizes statute titles, plain readings, and consequences into Bengali", () => {
    const statuteBn = getStatute("mta-2021-s11", "bn");
    expect(statuteBn).toBeDefined();
    expect(statuteBn?.citation).toContain("মডেল");
    expect(statuteBn?.title).toContain("জামানত");
    expect(statuteBn?.plain).toContain("ভাড়া");
    expect(statuteBn?.soWhat).toContain("মডেল টেন্যান্সি অ্যাক্ট");
  });

  it("attaches localized statutes through groundFindings when language is specified", () => {
    const { findings: findingsHi } = groundFindings(
      [finding({ statuteId: "ica-1872-s74" })],
      "hi",
    );
    expect(findingsHi[0]?.statute.title).toContain("जुर्माना");
    expect(findingsHi[0]?.statute.citation).toContain("भारतीय अनुबंध अधिनियम");

    const { findings: findingsBn } = groundFindings(
      [finding({ statuteId: "ica-1872-s74" })],
      "bn",
    );
    expect(findingsBn[0]?.statute.title).toContain("জরিমানা");
    expect(findingsBn[0]?.statute.citation).toContain("ভারতীয় চুক্তি আইন");
  });
});
