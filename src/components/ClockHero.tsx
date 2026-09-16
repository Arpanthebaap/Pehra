import type { Deadline } from "@/lib/clock";

function phrase(deadline: Deadline): string {
  const days = deadline.daysRemaining;
  if (days < 0) {
    const overdue = Math.abs(days);
    return `That window closed ${overdue} ${overdue === 1 ? "day" : "days"} ago`;
  }
  if (days === 0) return "Today is the last day";
  return `${days} ${days === 1 ? "day" : "days"} left`;
}

/**
 * The most urgent live deadline, stated as a sentence.
 *
 * This is the first thing on the page after an analysis because a running
 * clock is the thing people most often lose a winnable case to, and the thing
 * they are least likely to know about.
 */
export function ClockHero({ deadline }: { deadline: Deadline }) {
  return (
    <section
      className="clock-hero"
      data-status={deadline.status}
      aria-labelledby="clock-heading"
    >
      <h2 id="clock-heading">{phrase(deadline)}</h2>
      <p>
        {deadline.action}. The date to work to is{" "}
        <strong>{deadline.dueDate}</strong>.
      </p>
      <p className="basis">
        {deadline.basis}
        {deadline.statute ? ` (${deadline.statute.citation})` : ""}
        {deadline.customary
          ? " This one is convention rather than statute - check the document for the exact period it gives you."
          : ""}
      </p>
    </section>
  );
}

export { phrase as deadlinePhrase };
