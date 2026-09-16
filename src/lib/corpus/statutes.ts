/**
 * Pehra's grounding corpus.
 *
 * This is the single source of legal truth in the application. The language
 * model is never permitted to assert that a clause is void, or that a right is
 * missing, unless it can point at an `id` in this file. Findings that cite an
 * unknown id are discarded in `groundFindings()` before they reach the user.
 *
 * Summaries are plain-language paraphrases written for a non-lawyer, not
 * reproductions of statutory text. `citation` gives the reader the exact place
 * to verify the point for themselves.
 *
 * Scope note: this corpus covers the everyday agreements an ordinary person in
 * India is asked to sign - rent, employment, consumer purchases, loans. It is
 * deliberately narrow. Narrow and correct beats broad and wrong.
 */

export type LegalDomain =
  | "rent"
  | "employment"
  | "consumer"
  | "loan"
  | "general";

export interface Statute {
  /** Stable id. The model must return one of these to make a claim. */
  id: string;
  act: string;
  section: string;
  citation: string;
  /** Short title a non-lawyer can scan. */
  title: string;
  /** Plain-language paraphrase of the rule. Shown in the UI next to findings. */
  plain: string;
  /** What this provision lets a person actually do about it. */
  soWhat: string;
  domains: LegalDomain[];
}

export const STATUTES: readonly Statute[] = [
  {
    id: "ica-1872-s23",
    act: "Indian Contract Act, 1872",
    section: "Section 23",
    citation: "Indian Contract Act, 1872, s. 23",
    title: "Agreements against the law or public policy are void",
    plain:
      "An agreement is void if what it asks for is forbidden by law, would defeat the purpose of a law, or is opposed to public policy. Courts have used this to strike down terms that are grossly unfair between parties of very unequal bargaining power.",
    soWhat:
      "A void term binds nobody. You do not have to perform it, and the other side cannot enforce it in court - even though you signed.",
    domains: ["general", "employment", "rent", "consumer"],
  },
  {
    id: "ica-1872-s27",
    act: "Indian Contract Act, 1872",
    section: "Section 27",
    citation: "Indian Contract Act, 1872, s. 27",
    title: "Blanket bans on working elsewhere are void",
    plain:
      "An agreement that restrains someone from carrying on a lawful profession, trade or business is void to that extent. The main exception is the sale of a business's goodwill. Indian law is markedly stricter here than English or US law: a non-compete that bites after employment ends is generally unenforceable.",
    soWhat:
      "A clause stopping you from joining a competitor after you leave is usually unenforceable in India. Confidentiality and non-solicitation obligations are treated differently and may still hold.",
    domains: ["employment"],
  },
  {
    id: "ica-1872-s28",
    act: "Indian Contract Act, 1872",
    section: "Section 28",
    citation: "Indian Contract Act, 1872, s. 28",
    title: "Clauses that block you from going to court are void",
    plain:
      "An agreement that absolutely stops a party from enforcing their rights through the ordinary courts or tribunals, or that shortens the time limit the law gives them to do so, is void to that extent. Genuine arbitration agreements are carved out.",
    soWhat:
      "A term saying you 'waive all right to complain' or must sue within 30 days cannot take away a limitation period the law gives you.",
    domains: ["general", "consumer", "employment", "rent"],
  },
  {
    id: "ica-1872-s74",
    act: "Indian Contract Act, 1872",
    section: "Section 74",
    citation: "Indian Contract Act, 1872, s. 74",
    title: "A penalty written into a contract is a ceiling, not an entitlement",
    plain:
      "Where a contract names a sum to be paid on breach, the injured party is entitled only to reasonable compensation, not exceeding that sum, whether or not actual loss is proved. The named figure is an upper limit, and courts routinely award far less.",
    soWhat:
      "Automatic forfeiture of your whole deposit, or a flat penalty unconnected to any real loss, can be challenged. Ask them to show what they actually lost.",
    domains: ["general", "rent", "employment", "consumer"],
  },
  {
    id: "ica-1872-s16",
    act: "Indian Contract Act, 1872",
    section: "Section 16",
    citation: "Indian Contract Act, 1872, s. 16",
    title: "Contracts signed under undue influence can be set aside",
    plain:
      "Where one party is in a position to dominate the will of another and the transaction appears unconscionable, the burden shifts to the stronger party to prove the contract was not obtained by undue influence.",
    soWhat:
      "If you had no realistic choice but to sign - a standard form handed over with no negotiation - that imbalance is legally relevant, not just unfair.",
    domains: ["general", "employment", "loan"],
  },
  {
    id: "cpa-2019-s2-46",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(46)",
    citation: "Consumer Protection Act, 2019, s. 2(46)",
    title: "The law names six kinds of unfair contract term",
    plain:
      "An 'unfair contract' is one that causes significant change in a consumer's rights, including: demanding excessive security deposits; imposing a penalty on breach that is wholly disproportionate to the loss; refusing to accept early repayment; letting one side terminate without reasonable cause; letting one side assign the contract to your detriment without consent; or imposing any unreasonable charge or obligation that puts you at a disadvantage.",
    soWhat:
      "State and National Consumer Commissions can declare such terms null and void. You do not have to prove fraud - only unfairness.",
    domains: ["consumer", "rent", "loan", "general"],
  },
  {
    id: "cpa-2019-s69",
    act: "Consumer Protection Act, 2019",
    section: "Section 69",
    citation: "Consumer Protection Act, 2019, s. 69",
    title: "Two years to file a consumer complaint",
    plain:
      "A consumer complaint must be filed within two years from the date the cause of action arises. A commission may admit a later complaint only if it records reasons it is satisfied there was sufficient cause for the delay.",
    soWhat:
      "The clock starts when the problem happened, not when you found out you had rights. After two years your case can be dismissed without anyone looking at whether you were wronged.",
    domains: ["consumer"],
  },
  {
    id: "cpa-2019-s35",
    act: "Consumer Protection Act, 2019",
    section: "Section 35",
    citation: "Consumer Protection Act, 2019, s. 35",
    title: "You can file a consumer complaint yourself, where you live",
    plain:
      "A complaint may be filed by the consumer personally - no lawyer is required - before the District Commission where the consumer resides or works, in addition to where the other party operates. Filing can be done electronically.",
    soWhat:
      "You do not have to travel to the company's head office city, and you do not have to hire anyone to file.",
    domains: ["consumer"],
  },
  {
    id: "mta-2021-s11",
    act: "Model Tenancy Act, 2021",
    section: "Section 11",
    citation: "Model Tenancy Act, 2021, s. 11",
    title: "Security deposit capped at two months' rent for a home",
    plain:
      "Under the Model Tenancy Act the security deposit may not exceed two months' rent for residential premises, or six months' rent for non-residential premises, and must be refunded when the tenant vacates, after lawful deductions.",
    soWhat:
      "The Model Tenancy Act is a template the Centre circulated in 2021; it binds you only in States that have enacted it. Check your State's tenancy law - but a ten-month deposit is a strong signal something is wrong, and the cap is a reasonable benchmark to negotiate against.",
    domains: ["rent"],
  },
  {
    id: "mta-2021-s21",
    act: "Model Tenancy Act, 2021",
    section: "Section 21",
    citation: "Model Tenancy Act, 2021, s. 21",
    title: "A landlord cannot evict you by force",
    plain:
      "A tenant cannot be evicted except in accordance with the Act - which means an order from the Rent Authority or Rent Court. Cutting off essential supplies such as water or electricity to force a tenant out is separately prohibited.",
    soWhat:
      "Lock-changing, belongings thrown out, or power cut off is not a remedy the landlord has. It is something you can complain about.",
    domains: ["rent"],
  },
  {
    id: "limitation-1963-art55",
    act: "Limitation Act, 1963",
    section: "Article 55, Schedule",
    citation: "Limitation Act, 1963, Sch., Art. 55",
    title: "Three years to sue for breach of contract",
    plain:
      "A suit for compensation for breach of a contract must be brought within three years of the date the contract is broken, or - where the breach is continuing - when it stops.",
    soWhat:
      "Different from the two-year consumer window. If your matter is not a consumer dispute, this is usually the clock that applies.",
    domains: ["general", "rent", "employment", "loan"],
  },
  {
    id: "limitation-1963-art113",
    act: "Limitation Act, 1963",
    section: "Article 113, Schedule",
    citation: "Limitation Act, 1963, Sch., Art. 113",
    title: "Three years for anything the schedule does not otherwise cover",
    plain:
      "The residuary article: where no other article applies, the period is three years from when the right to sue accrues.",
    soWhat: "The default backstop clock when nothing more specific fits.",
    domains: ["general"],
  },
  {
    id: "ni-1881-s138",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 138",
    citation: "Negotiable Instruments Act, 1881, s. 138",
    title: "A bounced cheque has three deadlines, in sequence",
    plain:
      "When a cheque is returned unpaid: the payee must send a written demand within 30 days of receiving the bank's return memo; the drawer then has 15 days to pay; and if they do not, the complaint must be filed within one month of that 15-day period ending.",
    soWhat:
      "Miss the 30-day demand and the criminal remedy is gone for that cheque. This is the most commonly forfeited right in Indian commercial life.",
    domains: ["loan", "general"],
  },
  {
    id: "pwa-1936-s7",
    act: "Payment of Wages Act, 1936",
    section: "Section 7",
    citation: "Payment of Wages Act, 1936, s. 7",
    title: "Only listed deductions may be taken from wages",
    plain:
      "Wages must be paid without deductions except those the Act expressly authorises - such as fines imposed under the Act's own procedure, absence from duty, or recovery of advances. Total deductions are also capped as a proportion of wages.",
    soWhat:
      "An employer cannot invent a deduction. 'Training cost recovery' or an open-ended penalty taken from your salary needs a lawful basis.",
    domains: ["employment"],
  },
  {
    id: "lsa-1987-s12",
    act: "Legal Services Authorities Act, 1987",
    section: "Section 12",
    citation: "Legal Services Authorities Act, 1987, s. 12",
    title: "Who gets a free lawyer, as of right",
    plain:
      "Free legal services are available to, among others: members of Scheduled Castes and Scheduled Tribes; women and children; persons with disabilities; industrial workmen; victims of trafficking or mass disaster; persons in custody; and anyone whose annual income falls below the limit set by the State (or by the Centre for Supreme Court matters).",
    soWhat:
      "This is a right, not charity. Walk into your District Legal Services Authority at the district court complex, or call the NALSA helpline on 15100.",
    domains: ["general", "consumer", "employment", "rent", "loan"],
  },
] as const;

const BY_ID: ReadonlyMap<string, Statute> = new Map(
  STATUTES.map((s) => [s.id, s]),
);

export function getStatute(id: string): Statute | undefined {
  return BY_ID.get(id);
}

export function isKnownStatute(id: string): boolean {
  return BY_ID.has(id);
}

/** The id whitelist handed to the model, so it cannot invent a citation. */
export const STATUTE_IDS: readonly string[] = STATUTES.map((s) => s.id);

/**
 * A compact catalogue injected into the prompt. Kept terse on purpose: the
 * model needs enough to choose the right provision, not the whole corpus.
 */
export function corpusBriefing(): string {
  return STATUTES.map(
    (s) => `${s.id} | ${s.citation} | ${s.title} | applies to: ${s.domains.join(", ")}`,
  ).join("\n");
}
