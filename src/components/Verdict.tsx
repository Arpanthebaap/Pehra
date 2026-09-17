import type { Language, Verdict } from "@/lib/schema";
import { t } from "@/lib/i18n/translations";

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

export function VerdictBadge({
  verdict,
  language = "en",
}: {
  verdict: Verdict;
  language?: Language;
}) {
  const label = t(language).verdictLabels[verdict];
  return (
    <span className="verdict" data-verdict={verdict}>
      {label}
    </span>
  );
}

export { LABELS as VERDICT_LABELS };
