import type { Deadline } from "@/lib/clock";

export function DeadlineList({ deadlines }: { deadlines: readonly Deadline[] }) {
  if (deadlines.length === 0) {
    return (
      <p className="hint">
        No dates were written in this document, so there is no clock to run yet.
        If you know the date the problem started, add it to the text and read it
        again.
      </p>
    );
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
              ? `Closed ${Math.abs(deadline.daysRemaining)} days ago. `
              : `${deadline.daysRemaining} days remaining. `}
            Counted from: {deadline.sourceEvent.description} (
            {deadline.sourceEvent.date}). {deadline.basis}
          </span>
        </li>
      ))}
    </ol>
  );
}
