import type { Deadline } from "@/lib/clock";
import type { Language } from "@/lib/schema";
import { getStatute } from "@/lib/corpus/statutes";
import { t } from "@/lib/i18n/translations";

function phrase(deadline: Deadline, language: Language = "en"): string {
  const days = deadline.daysRemaining;
  const tr = t(language).clockHero;
  if (days < 0) {
    return tr.closedDaysAgo(Math.abs(days));
  }
  if (days === 0) return tr.lastDay;
  return tr.daysLeft(days);
}

/**
 * The most urgent live deadline, stated as a sentence.
 *
 * This is the first thing on the page after an analysis because a running
 * clock is the thing people most often lose a winnable case to, and the thing
 * they are least likely to know about.
 */
export function ClockHero({
  deadline,
  language = "en",
}: {
  deadline: Deadline;
  language?: Language;
}) {
  const tr = t(language);
  const statute = deadline.statute
    ? getStatute(deadline.statute.id, language) ?? deadline.statute
    : null;

  return (
    <section
      className="clock-hero"
      data-status={deadline.status}
      aria-labelledby="clock-heading"
    >
      <h2 id="clock-heading">{phrase(deadline, language)}</h2>
      <p>
        {deadline.action}
        {language === "hi" ? "। " : language === "bn" ? "। " : ". "}
        {tr.clockHero.dateToWorkTo}{" "}
        <strong>{deadline.dueDate}</strong>
        {language === "hi" ? " है।" : language === "bn" ? "।" : "."}
      </p>
      <p className="basis">
        {deadline.basis}
        {statute ? ` (${statute.citation})` : ""}
        {deadline.customary ? tr.clockHero.customaryNotice : ""}
      </p>
    </section>
  );
}

export { phrase as deadlinePhrase };
