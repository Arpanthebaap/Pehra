import { describe, expect, it } from "vitest";
import { corpusBriefing, getStatute, STATUTE_IDS, STATUTES } from "@/lib/corpus/statutes";
import type { Language } from "@/lib/schema";

describe("corpus integrity and localization", () => {
  it("defines the expected set of statutory provisions", () => {
    expect(STATUTES.length).toBeGreaterThanOrEqual(10);
    expect(STATUTE_IDS.length).toBe(STATUTES.length);
  });

  const languages: Language[] = ["en", "hi", "bn"];

  for (const lang of languages) {
    it(`localizes all statutes completely in ${lang}`, () => {
      for (const statute of STATUTES) {
        const localized = getStatute(statute.id, lang);
        expect(localized).toBeDefined();
        expect(localized?.title.trim().length).toBeGreaterThan(0);
        expect(localized?.plain.trim().length).toBeGreaterThan(0);
        expect(localized?.soWhat.trim().length).toBeGreaterThan(0);
        expect(localized?.citation.trim().length).toBeGreaterThan(0);
      }
    });
  }

  it("builds a concise, non-empty corpus briefing for prompting", () => {
    const briefing = corpusBriefing();
    expect(briefing.length).toBeGreaterThan(500);
    for (const id of STATUTE_IDS) {
      expect(briefing).toContain(id);
    }
  });

  it("returns undefined for unknown statute IDs safely", () => {
    expect(getStatute("non-existent-statute-id")).toBeUndefined();
  });
});
