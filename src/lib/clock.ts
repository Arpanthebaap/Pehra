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

import { getStatute, type Statute, type StatuteLanguage } from "./corpus/statutes";

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

const RULE_TRANSLATIONS: Record<
  "hi" | "bn",
  Record<string, { action: string; basis: string }>
> = {
  hi: {
    "cpa-complaint": {
      action: "अपनी उपभोक्ता शिकायत दर्ज करें",
      basis: "विवाद (वाद हेतुक) उत्पन्न होने की तारीख से दो वर्ष।",
    },
    "contract-suit": {
      action: "अनुबंध के उल्लंघन के लिए दीवानी मुकदमा दर्ज करें",
      basis: "अनुबंध टूटने की तारीख से तीन वर्ष।",
    },
    "ni-demand": {
      action: "चेक देने वाले व्यक्ति को लिखित मांग नोटिस भेजें",
      basis: "बैंक से चेक रिटर्न मेमो प्राप्त होने के तीस दिन।",
    },
    "ni-complaint-window": {
      action:
        "अपनी शिकायत दर्ज करने की तैयारी रखें - यह मांग नोटिस के 15 दिन बाद देय होती है, और उसके बाद के एक महीने के भीतर दर्ज की जानी चाहिए",
      basis:
        "मांग के लिए 30 दिन, फिर भुगतान के लिए 15 दिन, फिर शिकायत दर्ज करने के लिए एक महीना। सटीक तारीखों की पुष्टि किसी वकील से करें।",
    },
    "notice-reply": {
      action: "इस कानूनी नोटिस का लिखित जवाब भेजें",
      basis:
        "अधिकांश नोटिस 15-30 दिनों का समय देते हैं। यह प्रथागत है, कानून नहीं - सटीक अवधि के लिए नोटिस को ध्यान से पढ़ें।",
    },
    "appeal-state": {
      action: "राज्य उपभोक्ता आयोग में अपील दर्ज करें",
      basis: "जिला आयोग के आदेश से पैंतालीस दिन।",
    },
    "appeal-national": {
      action: "राष्ट्रीय उपभोक्ता आयोग में अपील दर्ज करें",
      basis: "राज्य आयोग के आदेश से तीस दिन।",
    },
  },
  bn: {
    "cpa-complaint": {
      action: "আপনার ভোক্তা অভিযোগ দায়ের করুন",
      basis: "অভিযোগের কারণ উদ্ভব হওয়ার তারিখ থেকে দুই বছর।",
    },
    "contract-suit": {
      action: "চুক্তি লঙ্ঘনের জন্য দেওয়ানি মামলা দায়ের করুন",
      basis: "চুক্তি ভঙ্গের তারিখ থেকে তিন বছর।",
    },
    "ni-demand": {
      action: "চেক প্রদানকারী ব্যক্তিকে লিখিত ডিমান্ড নোটিশ পাঠান",
      basis: "ব্যাংকের চেক রিটার্ন মেমো পাওয়ার পর থেকে ত্রিশ দিন।",
    },
    "ni-complaint-window": {
      action:
        "অভিযোগ দায়েরের প্রস্তুতি রাখুন - ডিমান্ড নোটিশের ১৫ দিন পর এটি প্রযোজ্য হয় এবং পরবর্তী এক মাসের মধ্যে দায়ের করতে হবে",
      basis:
        "নোটিশের জন্য ৩০ দিন, তারপর পরিশোধের জন্য ১৫ দিন, এরপর মামলা করার জন্য এক মাস। সুনির্দিষ্ট তারিখের জন্য একজন আইনজীবীর পরামর্শ নিন।",
    },
    "notice-reply": {
      action: "এই আইনি নোটিশের একটি লিখিত জবাব পাঠান",
      basis:
        "অধিকাংশ নোটিশে ১৫-৩০ দিন সময় দেওয়া হয়। এটি প্রচলিত প্রথা, আইন নয় - নির্দিষ্ট সময় জানার জন্য নোটিশটি পড়ুন।",
    },
    "appeal-state": {
      action: "রাজ্য ভোক্তা কমিশনে আপিল দায়ের করুন",
      basis: "জেলা কমিশনের আদেশের তারিখ থেকে পঁয়তাল্লিশ দিন।",
    },
    "appeal-national": {
      action: "জাতীয় ভোক্তা কমিশনে আপিল দায়ের করুন",
      basis: "রাজ্য কমিশনের আদেশের তারিখ থেকে ত্রিশ দিন।",
    },
  },
};

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
export function buildClock(
  events: readonly LegalEvent[],
  today: Date,
  language: StatuteLanguage = "en",
): Deadline[] {
  const deadlines: Deadline[] = [];

  for (const event of events) {
    const eventDate = parseIsoDate(event.date);
    if (!eventDate) continue;

    const rules = RULES[event.kind];
    if (!rules) continue;

    for (const rule of rules) {
      const due = addDays(eventDate, rule.days);
      const daysRemaining = daysBetween(today, due);
      const trans = language !== "en" ? RULE_TRANSLATIONS[language]?.[rule.id] : undefined;
      const action = trans?.action ?? rule.action;
      const basis = trans?.basis ?? rule.basis;

      deadlines.push({
        id: `${rule.id}:${event.date}`,
        action,
        dueDate: toIsoDate(due),
        daysRemaining,
        status: statusFor(daysRemaining),
        statute: rule.statuteId ? (getStatute(rule.statuteId, language) ?? null) : null,
        customary: rule.customary === true,
        basis,
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
