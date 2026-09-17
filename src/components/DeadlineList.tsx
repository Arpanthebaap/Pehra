import type { Deadline } from "@/lib/clock";
import type { Language } from "@/lib/schema";
import { t } from "@/lib/i18n/translations";

export function DeadlineList({
  deadlines,
  language = "en",
}: {
  deadlines: readonly Deadline[];
  language?: Language;
}) {
  const tr = t(language).deadlines;

  if (deadlines.length === 0) {
    return <p className="hint">{tr.empty}</p>;
  }

  return (
    <ol className="plain" style={{ listStyle: "none", paddingLeft: 0 }}>
      {deadlines.map((deadline) => (
        <li key={deadline.id} className="deadline" data-status={deadline.status}>
          <strong>{deadline.dueDate}</strong>
          {" \u2014 "}
          {deadline.action}
          <br />
          <span className="hint">
            {deadline.daysRemaining < 0
              ? tr.closedDaysAgo(Math.abs(deadline.daysRemaining))
              : tr.remainingDays(deadline.daysRemaining)}
            {tr.countedFrom}
            {deadline.sourceEvent.description} ({deadline.sourceEvent.date}).{" "}
            {deadline.basis}
          </span>
        </li>
      ))}
    </ol>
  );
}
