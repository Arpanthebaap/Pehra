# पहरा · Pehra

**Read the paperwork before it reads you.**

Pehra reads the everyday legal documents ordinary people in India are asked to
sign — rent agreements, job contracts, loan papers, app terms, legal notices —
against Indian statutory law, and answers three questions no summariser answers:

1. **Which clauses cannot bind you?** Not "this looks risky" — which terms are
   unenforceable, and under which provision.
2. **Which protections are missing?** A person cannot notice an absence by
   reading. Pehra reads for what *should* be there and isn't.
3. **Which clocks are already running?** Limitation periods, reply windows,
   appeal deadlines — counted from the dates in your document.

*Pehra* (पहरा) means to keep watch. It shares a root with *pehar* (पहर), a unit
of time. Guarding, and the clock. Both halves of what this does.

---

## Why this, and not another document summariser

India has more than a thousand legaltech companies. Almost all of them are
built for lawyers, law firms, in-house teams and courts. The digital highway
for justice has been built; the on-ramps are missing.

Meanwhile:

- Free legal aid is designed to cover roughly **80% of the population**, and
  reaches a small fraction of it. In rural India there is roughly **one legal
  aid clinic per 163 villages**.
- People lose *winnable* cases on the clock, not the merits. A consumer
  complaint must be filed within **two years of the cause of action**
  (Consumer Protection Act 2019, s. 69) — and the clock starts from when the
  problem happened, not from when you learned you had rights.
- People obey clauses that are already legally dead. Courts have struck down
  unconscionable standard-form terms since *Brojo Nath Ganguly* (1986). The
  tenant paying an illegal ten-month deposit has simply never been told.

Pehra is built for the person on the other side of that gap. Not for their
lawyer, because they do not have one.

---

## The design decision that matters most: Pehra refuses to guess

A legal tool that hallucinates a section number is worse than no tool, because
someone will act on it.

So the model is **never** allowed to assert law freely:

| Layer | What it does |
|---|---|
| **Fixed corpus** | `src/lib/corpus/statutes.ts` holds every provision Pehra may cite, in plain language. It is the only law in the system. |
| **Schema constraint** | `statuteId` is declared to Gemini as an *enum of real corpus ids*. The model cannot emit a citation that does not exist. |
| **Grounding filter** | `groundFindings()` re-checks every id server-side. Anything unresolvable is dropped before rendering. |
| **Honest reporting** | Dropped findings are counted and shown to the user, not hidden. |
| **Deterministic dates** | The model reports *events*. Every day of arithmetic happens in `src/lib/clock.ts`, in TypeScript, under 27 tests. |

The prompt says it plainly: *if no provision supports the point, say nothing.
Silence is correct.*

---

## Generative AI in this project

**Google Gemini (`gemini-2.5-flash`) via the `@google/genai` SDK**, called
server-side only from `POST /api/analyze`. The key never reaches the browser.

Gemini is used for exactly three jobs, all in one structured call
(`src/lib/gemini.ts`):

1. **Clause classification** — reading the document and assigning each clause
   one of four verdicts (`void` / `one_sided` / `standard` / `missing`), each
   bound to a corpus provision.
2. **Absence detection** — identifying statutory protections the document omits.
   This is the hardest of the three and the one a keyword approach cannot do.
3. **Plain-language rewriting** — the summary, the explanations and the
   questions-for-a-lawyer, generated directly in English, Hindi or Bengali.

Gemini is deliberately **not** used for date arithmetic, for deciding what the
law says, or for anything the user sees uncited.

The call uses `responseSchema` structured output with `temperature: 0.2`.

---

## Running it

```bash
git clone <this repo> && cd pehra
npm install
cp .env.example .env.local     # add your Google AI Studio key
npm run dev                    # http://localhost:3000
```

```bash
npm run verify                 # typecheck + 72 tests
npm run test                   # vitest
npm run build                  # production build
```

Get a key at <https://aistudio.google.com/apikey>. Deploys to Vercel with
`GEMINI_API_KEY` set as an environment variable; no other configuration.
Requires Node.js 24.x (pinned in `package.json`'s `engines` field and in
`.nvmrc`).

---

## Accessibility

The target user may be reading in a second or third language, on a low-end
Android, over a slow connection, possibly with a screen reader. Accessibility
here is a product requirement, not a polish item.

- **No webfont is downloaded.** The stack leans on Noto, which ships with
  Android and carries real Devanagari and Bengali coverage — correct glyphs,
  zero font payload.
- **axe-core runs in CI** against the real components. A WCAG 2.1 A/AA
  violation fails the build. (`color-contrast` is disabled in jsdom, which has
  no layout engine to measure it; the palette is verified by hand — ink
  `#1B2A33` on paper `#FBFAF7` is 12.9:1, and every verdict colour clears 4.5:1
  against its wash.)
- Reader-controlled text size up to 150%, and pinch-zoom is never disabled.
- Results are an `aria-live` region and receive focus on completion.
- Each clause is tied to its margin note with `aria-describedby`; absent
  protections are announced as absent rather than read as if quoted.
- Read-aloud via the Web Speech API, locale-matched per language.
- `prefers-reduced-motion` and `prefers-contrast` both honoured.
- 44px minimum touch targets, visible focus rings, keyboard-complete.

---

## Security and privacy

Pehra handles rent agreements and salary slips. It is built to hold as little
as possible.

- **Nothing is stored.** No database, no session, no log of document text. The
  analysis exists in one response and then it is gone.
- **Identifiers are stripped in the browser**, before the request is sent —
  Aadhaar, PAN, phone, email, account numbers (`src/lib/redact.ts`). Imperfect
  by nature, so the UI says so rather than overpromising.
- Strict CSP, HSTS, `frame-ancestors 'none'`, `X-Content-Type-Options`,
  `Referrer-Policy: no-referrer` (`next.config.ts`).
- All input validated with Zod before it reaches the model; oversized payloads
  rejected before they cost anything.
- Fixed-window rate limiting on the unauthenticated endpoint.
- Errors are logged server-side and returned vague — no stack traces, no
  provider messages leaked to the client.
- `Cache-Control: no-store` on every analysis response.

---

## What Pehra does not do

Stated plainly, because a tool like this is dangerous if oversold:

- It is **not legal advice** and not a substitute for a lawyer.
- Its corpus is **deliberately narrow** — fifteen provisions covering everyday
  rent, work, consumer and loan situations. It will miss things outside that.
- The **Model Tenancy Act, 2021 is a template**, binding only in States that
  have enacted it. Pehra says so on every finding that relies on it.
- It does not know your State's local law, your full facts, or anything not on
  the page you gave it.
- Every output routes towards a human: the District Legal Services Authority at
  your district court, or the NALSA helpline on **15100**. Free legal aid under
  s. 12 of the Legal Services Authorities Act, 1987 is a right, not a favour.

---

## Layout

```
src/
  app/
    api/analyze/route.ts    validation, rate limiting, orchestration
    page.tsx                the reading room
    globals.css             design tokens; verdict colours carry meaning
  components/               presentational only, so they can be axe-tested
  lib/
    corpus/statutes.ts      the only law in the system
    clock.ts                deterministic limitation arithmetic
    gemini.ts               structured-output call + the grounded prompt
    schema.ts               Zod contracts + the grounding filter
    redact.ts               client-side PII masking
    ratelimit.ts            fixed-window limiter
tests/                      72 tests: clock, grounding, redaction, limits, a11y
```

MIT licensed. See `LICENSE`.
