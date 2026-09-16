import type { Verdict } from "@/lib/schema";

/**
 * Verdict wording is deliberately written as a statement about the reader's
 * position, not as a category label. "Not binding on you" tells someone what to
 * do with the information; "VOID" only tells them a lawyer's word for it.
 */
const LABELS: Record<Verdict, string> = {
  void: "Not binding on you",
  one_sided: "Legal, but weighted against you",
  standard: "Ordinary",
  missing: "Protection missing",
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span className="verdict" data-verdict={verdict}>
      {LABELS[verdict]}
    </span>
  );
}

export { LABELS as VERDICT_LABELS };
