/**
 * The Pehra Clock.
 *
 * Language models are unreliable at date arithmetic, and a wrong deadline in a
 * legal tool is worse than no deadline at all. So the model's only job is to
 * spot *events* and their dates. Every day counted below is counted here, in
 * plain TypeScript, and every branch of it is covered by tests.
 *
 * All computation is in UTC whole days to avoid timezone drift. A deadline is
 * a calendar date, not an instant.
 */

import { getStatute, type Statute } from "./corpus/statutes";

/** Events a document or a user's account of events can give rise to. */
export type EventKind =
  | "consumer_cause_of_action"
  | "contract_breach"
  | "cheque_return_memo"
  | "legal_notice_received"
  | "district_commission_order"
  | "state_commission_order";

export interface LegalEvent {
  kind: EventKind;
  /** ISO calendar date, YYYY-MM-DD. */
  date: string;
  /** What in the document or account this was drawn from. */
  description: string;
}

export type ClockStatus = "expired" | "critical" | "urgent" | "safe";

export interface Deadline {
  id: string;
  /** What must be done. Written as an action, not a label. */
  action: string;
  /** ISO date by which it must be done. */
  dueDate: string;
  daysRemaining: number;
  status: ClockStatus;
  /** Where this period comes from. Null for customary, non-statutory windows. */
  statute: Statute | null;
  /** True when the window is convention rather than law. */
  customary: boolean;
  basis: string;
  sourceEvent: LegalEvent;
}

interface Rule {
  id: string;
  action: string;
  days: number;
  statuteId: string | null;
  customary?: boolean;
  basis: string;
}

/**
 * Statutory windows, in days from the triggering event.
 *
 * Deliberately conservative: where a period is expressed in months the shorter
 * safe reading is used, because telling someone they have longer than they do
 * is the one failure mode with no remedy.
 */
const RULES: Readonly<Record<EventKind, readonly Rule[]>> = {
  consumer_cause_of_action: [
    {
      id: "cpa-complaint",
      action: "File your consumer complaint",
      days: 730,
      statuteId: "cpa-2019-s69",
      basis: "Two years from the date the cause of action arose.",
    },
  ],
  contract_breach: [
    {
      id: "contract-suit",
      action: "File a civil suit for breach of contract",
      days: 1095,
      statuteId: "limitation-1963-art55",
      basis: "Three years from the date the contract was broken.",
    },
  ],
  cheque_return_memo: [
    {
      id: "ni-demand",
      action: "Send a written demand notice to the person who gave the cheque",
      days: 30,
      statuteId: "ni-1881-s138",
      basis: "Thirty days from receiving the bank's cheque return memo.",
    },
    {
      id: "ni-complaint-window",
      action:
        "Expect to file your complaint - it becomes due 15 days after the demand notice, and must be filed within the month that follows",
      days: 75,
      statuteId: "ni-1881-s138",
      basis:
        "30 days to demand, then 15 days for them to pay, then one month to file. Confirm exact dates with a lawyer.",
    },
  ],
  legal_notice_received: [
    {
      id: "notice-reply",
      action: "Send a written reply to this legal notice",
      days: 30,
      statuteId: null,
      customary: true,
      basis:
        "Most notices allow 15-30 days. This is convention, not a statute - read the notice for the exact period it gives you.",
    },
  ],
  district_commission_order: [
    {
      id: "appeal-state",
      action: "File an appeal to the State Consumer Commission",
      days: 45,
      statuteId: "cpa-2019-s69",
      basis: "Forty-five days from the District Commission's order.",
    },
  ],
  state_commission_order: [
    {
      id: "appeal-national",
      action: "File an appeal to the National Consumer Commission",
      days: 30,
      statuteId: "cpa-2019-s69",
      basis: "Thirty days from the State Commission's order.",
    },
  ],
};

const MS_PER_DAY = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Parses a YYYY-MM-DD date as UTC midnight. Returns null if not a real date. */
export function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  // Rejects overflow like 2026-02-31, which Date would silently roll forward.
  if (parsed.toISOString().slice(0, 10) !== value) return null;
  return parsed;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/** Whole calendar days between two dates. Negative when `to` is in the past. */
export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export function statusFor(daysRemaining: number): ClockStatus {
  if (daysRemaining < 0) return "expired";
  if (daysRemaining <= 14) return "critical";
  if (daysRemaining <= 60) return "urgent";
  return "safe";
}

/**
 * Turns events into dated, sorted deadlines.
 *
 * Events whose date cannot be parsed are skipped rather than guessed at.
 * Sorting puts whatever is closest to running out at the top, because that is
 * the only thing most people have the attention to act on.
 */
export function buildClock(events: readonly LegalEvent[], today: Date): Deadline[] {
  const deadlines: Deadline[] = [];

  for (const event of events) {
    const eventDate = parseIsoDate(event.date);
    if (!eventDate) continue;

    const rules = RULES[event.kind];
    if (!rules) continue;

    for (const rule of rules) {
      const due = addDays(eventDate, rule.days);
      const daysRemaining = daysBetween(today, due);
      deadlines.push({
        id: `${rule.id}:${event.date}`,
        action: rule.action,
        dueDate: toIsoDate(due),
        daysRemaining,
        status: statusFor(daysRemaining),
        statute: rule.statuteId ? (getStatute(rule.statuteId) ?? null) : null,
        customary: rule.customary === true,
        basis: rule.basis,
        sourceEvent: event,
      });
    }
  }

  return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * The single deadline to put in front of someone first: the soonest one that
 * has not already expired. If everything has expired, the most recently
 * expired one - because a person still needs to know, and condonation of delay
 * under s. 69 may still be open to them.
 */
export function mostUrgent(deadlines: readonly Deadline[]): Deadline | null {
  const live = deadlines.filter((d) => d.daysRemaining >= 0);
  if (live.length > 0) return live[0] ?? null;
  return deadlines.length > 0 ? (deadlines[deadlines.length - 1] ?? null) : null;
}
