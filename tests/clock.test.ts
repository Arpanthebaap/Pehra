import { describe, expect, it } from "vitest";
import {
  addDays,
  buildClock,
  daysBetween,
  mostUrgent,
  parseIsoDate,
  statusFor,
  toIsoDate,
  type LegalEvent,
} from "@/lib/clock";

const utc = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("parseIsoDate", () => {
  it("accepts a well-formed date", () => {
    expect(toIsoDate(parseIsoDate("2026-01-12")!)).toBe("2026-01-12");
  });

  it.each(["12-01-2026", "2026/01/12", "2026-1-2", "", "yesterday"])(
    "rejects malformed input: %s",
    (input) => {
      expect(parseIsoDate(input)).toBeNull();
    },
  );

  it("rejects dates that do not exist rather than rolling them forward", () => {
    // Date() would silently turn this into 3 March. That would be a wrong deadline.
    expect(parseIsoDate("2026-02-31")).toBeNull();
    expect(parseIsoDate("2025-02-29")).toBeNull();
  });

  it("accepts a real leap day", () => {
    expect(parseIsoDate("2024-02-29")).not.toBeNull();
  });
});

describe("date arithmetic", () => {
  it("crosses a month boundary correctly", () => {
    expect(toIsoDate(addDays(utc("2026-01-20"), 30))).toBe("2026-02-19");
  });

  it("crosses a year boundary correctly", () => {
    expect(toIsoDate(addDays(utc("2025-12-20"), 30))).toBe("2026-01-19");
  });

  it("counts a leap year correctly over two years", () => {
    // 2024 is a leap year, so 730 days from 2023-03-01 lands a day 'early'.
    expect(toIsoDate(addDays(utc("2023-03-01"), 730))).toBe("2025-02-28");
  });

  it("returns negative days for a date in the past", () => {
    expect(daysBetween(utc("2026-09-16"), utc("2026-09-01"))).toBe(-15);
  });
});

describe("statusFor", () => {
  it.each([
    [-1, "expired"],
    [0, "critical"],
    [14, "critical"],
    [15, "urgent"],
    [60, "urgent"],
    [61, "safe"],
  ] as const)("maps %i days to %s", (days, expected) => {
    expect(statusFor(days)).toBe(expected);
  });
});

describe("buildClock", () => {
  const today = utc("2026-09-16");

  it("applies the two-year consumer limitation period", () => {
    const events: LegalEvent[] = [
      {
        kind: "consumer_cause_of_action",
        date: "2026-01-12",
        description: "Deposit paid, possession not given",
      },
    ];
    const [deadline] = buildClock(events, today);
    expect(deadline?.dueDate).toBe("2028-01-12");
    expect(deadline?.statute?.id).toBe("cpa-2019-s69");
    expect(deadline?.status).toBe("safe");
  });

  it("produces the full three-stage cheque sequence in order", () => {
    const deadlines = buildClock(
      [{ kind: "cheque_return_memo", date: "2026-09-01", description: "Return memo" }],
      today,
    );
    expect(deadlines).toHaveLength(2);
    expect(deadlines[0]?.dueDate).toBe("2026-10-01");
    expect(deadlines[1]?.dueDate).toBe("2026-11-15");
  });

  it("marks a notice reply window as customary, not statutory", () => {
    const [deadline] = buildClock(
      [{ kind: "legal_notice_received", date: "2026-09-10", description: "Notice" }],
      today,
    );
    expect(deadline?.customary).toBe(true);
    expect(deadline?.statute).toBeNull();
  });

  it("reports an expired window rather than hiding it", () => {
    const [deadline] = buildClock(
      [{ kind: "consumer_cause_of_action", date: "2020-01-01", description: "Old" }],
      today,
    );
    expect(deadline?.status).toBe("expired");
    expect(deadline?.daysRemaining).toBeLessThan(0);
  });

  it("skips unparseable dates instead of guessing at them", () => {
    expect(
      buildClock(
        [{ kind: "contract_breach", date: "sometime in March", description: "?" }],
        today,
      ),
    ).toHaveLength(0);
  });

  it("sorts the soonest deadline first", () => {
    const deadlines = buildClock(
      [
        { kind: "contract_breach", date: "2026-09-01", description: "Breach" },
        { kind: "legal_notice_received", date: "2026-09-14", description: "Notice" },
      ],
      today,
    );
    expect(deadlines[0]?.action).toContain("reply");
  });
});

describe("mostUrgent", () => {
  const today = utc("2026-09-16");

  it("returns the soonest deadline that has not expired", () => {
    const deadlines = buildClock(
      [
        { kind: "consumer_cause_of_action", date: "2019-01-01", description: "Expired" },
        { kind: "legal_notice_received", date: "2026-09-14", description: "Live" },
      ],
      today,
    );
    expect(mostUrgent(deadlines)?.sourceEvent.description).toBe("Live");
  });

  it("still surfaces an expired deadline when nothing is live, so the user knows", () => {
    const deadlines = buildClock(
      [{ kind: "consumer_cause_of_action", date: "2019-01-01", description: "Expired" }],
      today,
    );
    expect(mostUrgent(deadlines)?.status).toBe("expired");
  });

  it("returns null when there is nothing to report", () => {
    expect(mostUrgent([])).toBeNull();
  });
});
