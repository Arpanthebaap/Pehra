import { z } from "zod";
import { isKnownStatute, getStatute, type Statute } from "./corpus/statutes";

export const LANGUAGES = ["en", "hi", "bn"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DOCUMENT_KINDS = [
  "rent_agreement",
  "employment_contract",
  "loan_agreement",
  "consumer_terms",
  "legal_notice",
  "undocumented_arrangement",
  "other",
] as const;

export const VERDICTS = ["void", "one_sided", "standard", "missing"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const EVENT_KINDS = [
  "consumer_cause_of_action",
  "contract_breach",
  "cheque_return_memo",
  "legal_notice_received",
  "district_commission_order",
  "state_commission_order",
] as const;

/** Upper bound on input size. Generous for a rent agreement, hostile to abuse. */
export const MAX_DOCUMENT_CHARS = 60_000;

export const analyzeRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(40, "Paste at least a paragraph so there is something to read.")
    .max(
      MAX_DOCUMENT_CHARS,
      "That document is too long. Paste the sections you are worried about.",
    ),
  language: z.enum(LANGUAGES).default("en"),
  /** Today, as the client sees it. Bounded so a forged value cannot skew clocks far. */
  today: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date.")
    .optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

/** The shape Gemini is constrained to return. Kept flat - nested unions confuse structured output. */
export const modelFindingSchema = z.object({
  clause: z.string().min(1).max(2000),
  verdict: z.enum(VERDICTS),
  statuteId: z.string(),
  explanation: z.string().min(1).max(1200),
  confidence: z.enum(["high", "medium", "low"]),
});

export const modelEventSchema = z.object({
  kind: z.enum(EVENT_KINDS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1).max(500),
});

export const modelInconsistencySchema = z.object({
  clauseA: z.string().min(1).max(1000),
  clauseB: z.string().min(1).max(1000),
  explanation: z.string().min(1).max(1000),
  severity: z.enum(["high", "medium"]),
});

export const modelOptionSchema = z.object({
  category: z.enum(["negotiation", "dispute_resolution", "legal_aid", "pre_signing"]),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(1000),
  actionableStep: z.string().min(1).max(500),
});

export const modelChecklistItemSchema = z.object({
  id: z.string(),
  task: z.string().min(1).max(400),
  priority: z.enum(["urgent", "recommended", "optional"]),
  category: z.string(),
});

export const modelOutputSchema = z.object({
  documentKind: z.enum(DOCUMENT_KINDS),
  summary: z.string().min(1).max(2000),
  findings: z.array(modelFindingSchema).max(30),
  events: z.array(modelEventSchema).max(20),
  questionsForALawyer: z.array(z.string().min(1).max(400)).max(10),
  inconsistencies: z.array(modelInconsistencySchema).max(10).default([]),
  optionsAndNextSteps: z.array(modelOptionSchema).max(10).default([]),
  actionableChecklist: z.array(modelChecklistItemSchema).max(15).default([]),
});

export type ModelOutput = z.infer<typeof modelOutputSchema>;
export type ModelFinding = z.infer<typeof modelFindingSchema>;
export type ModelInconsistency = z.infer<typeof modelInconsistencySchema>;
export type ModelOption = z.infer<typeof modelOptionSchema>;
export type ModelChecklistItem = z.infer<typeof modelChecklistItemSchema>;

export interface GroundedFinding extends Omit<ModelFinding, "statuteId"> {
  statute: Statute;
}

export interface GroundingResult {
  findings: GroundedFinding[];
  /** Claims the model made that it could not source. Surfaced, never hidden. */
  discarded: number;
}

/**
 * The guardrail.
 *
 * A finding survives only if it cites a provision that actually exists in our
 * corpus. Everything else is dropped - we would rather say less than say
 * something a user might act on and find is not the law.
 *
 * `standard` findings are exempt: asserting that a clause is ordinary and needs
 * no action is not a legal claim that requires authority.
 */
export function groundFindings(
  findings: readonly ModelFinding[],
  language: Language = "en",
): GroundingResult {
  const kept: GroundedFinding[] = [];
  let discarded = 0;

  for (const finding of findings) {
    if (finding.verdict === "standard") continue;

    if (!isKnownStatute(finding.statuteId)) {
      discarded += 1;
      continue;
    }
    const statute = getStatute(finding.statuteId, language);
    if (!statute) {
      discarded += 1;
      continue;
    }

    const { statuteId: _statuteId, ...rest } = finding;
    kept.push({ ...rest, statute });
  }

  const order: Record<Verdict, number> = {
    void: 0,
    missing: 1,
    one_sided: 2,
    standard: 3,
  };
  kept.sort((a, b) => order[a.verdict] - order[b.verdict]);

  return { findings: kept, discarded };
}
