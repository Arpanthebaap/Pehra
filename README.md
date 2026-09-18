# पहरा · Pehra

**AI for Legal Assistance & Access · Read the paperwork before it reads you.**

Pehra is an AI watchkeeper engineered for ordinary Indian citizens who are asked to sign everyday legal paperwork — rental agreements, employment contracts, instant digital loans, app terms, and legal notices. It evaluates documents against Indian statutory law, answers questions interactively, and compares contract revisions to protect users from unconscionable clauses, stripped protections, and expired limitation periods.

Deployed Application: **[pehra-zeta.vercel.app](https://pehra-zeta.vercel.app/)**  
Public GitHub Repository: **[github.com/Arpanthebaap/Pehra](https://github.com/Arpanthebaap/Pehra)**

---

## Challenge & Problem Statement Alignment: AI for Legal Assistance & Access

### Problem Statement Mandate
> *"Legal information can often be complex, difficult to understand, and challenging to navigate without professional assistance. Build a GenAI-powered solution that makes legal information and basic legal assistance more accessible by helping users understand, compare, and navigate legal documents and information."*

Pehra directly addresses all 7 core use cases outlined in the challenge specification:

| Challenge Use Case | Pehra Feature & Implementation | Technical Architecture | Verification |
|---|---|---|---|
| **1. Simplifying complex legal documents** | Generates clear, plain-language summaries and clause translations in **English, Hindi, and Bengali**, stripping legalese into everyday actionable terms. | Gemini 2.5 Flash via `@google/genai` with strict zero-jargon system prompt instructions (`src/lib/gemini.ts`). | Multilingual UI tests (`tests/ui.test.tsx`) |
| **2. Comparing contracts, agreements, or policies** | **Contract Comparison Mode**: Side-by-side comparison between original agreements and renewal/amendment versions (e.g., lease renewals, employment amendments). Highlights new obligations, removed protections, and overall risk delta. | `src/lib/compare.ts`, `POST /api/compare`, and `ComparisonView.tsx` with schema-enforced change classification. | `tests/compare.test.ts` (6 tests) |
| **3. Highlighting important clauses, obligations, risks, or inconsistencies** | Evaluates clauses under 4 strict verdicts: `void` (unenforceable under law), `one_sided` (oppressive), `standard` (ordinary), and `missing` (statutory rights omitted). | Schema-constrained enum mapped to a curated corpus of 15 Indian statutory provisions (`src/lib/corpus/statutes.ts`). | `tests/grounding.test.ts` (14 tests) |
| **4. Answering questions based on provided legal documents** | **Interactive Document Q&A ("Ask Pehra")**: Users can ask specific questions about deposit refunds, non-competes, or notices. Features 1-click suggested prompts and freeform queries. | `src/lib/qa.ts`, `POST /api/ask`, and `DocumentQA.tsx` strictly grounded in the document text and statutory corpus. | `tests/qa.test.ts` (5 tests) |
| **5. Helping users understand their options and potential next steps** | **Deterministic Clock Engine & Limitation Watchkeeper**: Computes exact days remaining for statutory consumer complaints, cheque bounce notice replies (s. 138), and appeal windows. | `src/lib/clock.ts` in pure TypeScript arithmetic; never delegates date arithmetic to LLM guesswork. | `tests/clock.test.ts` (30 tests) |
| **6. Generating summaries, checklists, or other actionable outputs** | **Actionable Legal Checklist & Export**: Visual breakdown of void terms, one-sided clauses, missing protections, and deadlines with "Print for Lawyer" and "Copy Case Briefing". | Client-side briefing formatter and dedicated `@media print` stylesheet formatted for NALSA/DLSA intake. | `tests/ui.test.tsx` |
| **7. Helping users prepare information or questions for a legal professional** | Generates case-tailored questions for the user to present at their District Legal Services Authority (DLSA) or via the NALSA 15100 helpline under s. 12 of the Legal Services Authorities Act, 1987. | `questionsForALawyer` output field, routing ordinary citizens directly to free state-guaranteed legal aid. | `tests/route.test.ts` |

---

## Core Pillars & System Architecture

### 1. Grounded GenAI Architecture (Gemini 2.5 Flash)
- **Zero-Hallucination Law Corpus**: Pehra never allows the LLM to invent legal sections or cite imaginary precedent. The model can cite **only** from a curated catalogue of 15 statutory provisions in `src/lib/corpus/statutes.ts`.
- **Response Schema Constraint**: The `statuteId` is passed as a strict enum of real corpus IDs via `@google/genai` structured outputs. The model cannot return a non-existent citation.
- **Server-Side Grounding Filter**: `groundFindings()` and `groundComparisonChanges()` re-verify every statute ID on the server. If any citation fails resolution, it is dropped and honestly reported to the user (`ungroundedClaimsDiscarded`).
- **Token Efficiency**: Tuned prompt budgeting (`maxOutputTokens: 4096` for analysis/comparison, `2048` for Q&A) and temperature `0.2` for deterministic, reliable legal analysis.

### 2. High-Performance Efficiency (0ms Client Cache & Compression)
- **Client-Side Session Caching**: Analysis and comparison results are cached in-memory and in `sessionStorage` by content hash. Re-analyzing or toggling between sample presets returns **instantaneous 0ms results** without making redundant network or API calls.
- **Response Compression**: Gzip/Brotli compression enabled in `next.config.ts` (`compress: true`).
- **Connection Reuse**: HTTP keep-alive agent enabled (`httpAgentOptions: { keepAlive: true }`).
- **Bounded Rate Limiter with Active TTL Garbage Collection**: Sliding-window rate limiter in `src/lib/ratelimit.ts` with periodic sweep intervals (every 50 requests) and LRU eviction, capping memory at 10,000 keys to prevent memory leaks under high concurrent traffic.

### 3. Security & Privacy Hardening
- **Zero Server-Side Storage**: No database, no user accounts, no persistence of legal paperwork. Documents exist in memory for the duration of the request and are immediately discarded.
- **Browser-Side Indian PII Redaction (`src/lib/redact.ts`)**: Automatically redacts 10 Indian personal identifier types before transmission:
  - Aadhaar numbers (Verhoeff algorithm-validated formatting)
  - Permanent Account Numbers (PAN)
  - Indian Voter ID cards (EPIC)
  - Indian Passports
  - Bank IFSC Codes
  - Unified Payments Interface IDs (UPI / VPA)
  - Vehicle Registration Numbers (RC)
  - Indian Mobile Numbers (+91)
  - Email Addresses
  - Bank Account Numbers
- **Prompt Injection & Adversarial Defense**: Legal documents are enclosed between strict boundary tags (`<<<USER_DOCUMENT_START>>> ... <<<USER_DOCUMENT_END>>>`). The system prompt includes explicit security directives ordering the model to treat all document content strictly as passive data and ignore embedded instructions, prompt overrides, or jailbreaks.
- **CSRF & Origin Protection**: All mutative POST endpoints (`/api/analyze`, `/api/compare`, `/api/ask`) enforce Fetch Metadata checks (`sec-fetch-site !== "cross-site"`).
- **Hardened HTTP Headers**: Strict CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-Download-Options: noopen`, `X-Permitted-Cross-Domain-Policies: none`, `Referrer-Policy: no-referrer`, and restrictive `Permissions-Policy`.

### 4. Accessibility & Digital Inclusion (100/100 Score)
- **Zero Webfont Payload**: Leans on system fonts and Google Noto, natively supported across budget Android devices with authentic Devanagari and Bengali typography.
- **axe-core Automated CI Testing**: Zero WCAG 2.1 A/AA violations verified in CI. High contrast ratios (ink `#1B2A33` on paper `#FBFAF7` achieves 12.9:1, well above the 4.5:1 requirement).
- **Assistive Technology Integration**: ARIA live regions (`aria-live="polite"`), `aria-describedby` links between clauses and margin notes, full keyboard navigation, and Web Speech API read-aloud matching user language (`hi-IN`, `bn-IN`, `en-IN`).
- **User-Controlled Font Sizing**: Dynamic text resizing (100%, 125%, 150%) without breaking layout or disabling pinch-zoom.

---

## Statutory Corpus Coverage

Pehra's engine is grounded in 15 vital Indian statutory provisions:

1. **Indian Contract Act, 1872, s. 23**: Unconscionable terms opposed to public policy are void.
2. **Indian Contract Act, 1872, s. 27**: Post-employment non-compete covenants are void.
3. **Indian Contract Act, 1872, s. 28**: Clauses barring access to courts or consumer forums are void.
4. **Indian Contract Act, 1872, s. 74**: Unreasonable bond forfeitures and penalties are ceilings, not automatic entitlements.
5. **Indian Contract Act, 1872, s. 16**: Agreements executed under undue influence or gross power imbalance.
6. **Consumer Protection Act, 2019, s. 2(46)**: Unfair contract terms, excessive deposits, and unilateral alterations.
7. **Consumer Protection Act, 2019, s. 69**: 2-year limitation period from the date the cause of action arose.
8. **Consumer Protection Act, 2019, s. 35**: Right to file complaints without a lawyer in your home jurisdiction.
9. **Consumer Protection Act, 2019, s. 41**: 45-day window to appeal a District Commission order to the State Commission.
10. **Consumer Protection Act, 2019, s. 51**: 30-day window to appeal a State Commission order to the National Commission.
11. **Model Tenancy Act, 2021, s. 11**: Security deposit capped at two months' rent for residential premises.
12. **Model Tenancy Act, 2021, s. 20**: Mandatory 24 hours prior notice before landlord inspection.
13. **Model Tenancy Act, 2021, s. 21**: Strict prohibition on cutting off water or electricity supplies.
14. **Negotiable Instruments Act, 1881, s. 138 & s. 142**: 15-day statutory payment demand window and 30-day magistrate complaint limitation.
15. **Payment of Wages Act, 1936, s. 7 & s. 8**: Strict prohibition on unauthorized employer deductions and arbitrary fines.

---

## Running & Testing Pehra

### Prerequisites
- Node.js 20.x or 22.x (or 24.x)
- Google AI Studio Gemini API Key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Quick Start
```bash
git clone https://github.com/Arpanthebaap/Pehra.git
cd Pehra
npm install
cp .env.example .env.local    # Paste your GEMINI_API_KEY
npm run dev                   # Open http://localhost:3000
```

### Verification & Automated Test Suite
```bash
npm run verify                # Runs tsc --noEmit typecheck + Vitest suite
npm run test                  # Vitest runner
npm run build                 # Next.js optimized production build
```

**Test Verification Summary**:
- **138 tests passing across 13 test suites (100% pass rate)**:
  - `tests/compare.test.ts` (Contract comparison engine, grounding, route guards)
  - `tests/qa.test.ts` (Document Q&A engine, prompt validation, route guards)
  - `tests/security.test.ts` (Prompt injection containment, Unicode NFKC, CSRF Sec-Fetch-Site, payload guards)
  - `tests/accessibility.test.tsx` (axe-core WCAG 2.1 A/AA compliance)
  - `tests/clock.test.ts` (Deterministic limitation periods, appeal windows, notice deadlines)
  - `tests/redact.test.ts` (10 Indian PII identifier regex patterns)
  - `tests/ratelimit.test.ts` (Bounded sliding window, IP validation, active TTL cleanup)
  - `tests/corpus.test.ts` (15 statutes across English, Hindi, and Bengali)
  - `tests/samples.test.ts` (5 single-document presets, 2 comparison presets, quick questions)
  - `tests/route.test.ts` (API route validation, error handling, rate limits)
  - `tests/ui.test.tsx` (Mode tabs, preset loading, language switching, form controls)
  - `tests/grounding.test.ts` (Grounding filter, ungrounded claim dropping)
  - `tests/request.test.ts` (Payload validation schemas)

---

## Directory Structure

```
src/
  app/
    api/
      analyze/route.ts        Validation, PII, rate limiting, single-document analysis
      compare/route.ts        Contract & policy comparison endpoint
      ask/route.ts            Interactive document Q&A endpoint
    page.tsx                  Reading room with mode switcher, comparison view, & Q&A
    error.tsx                 Accessible client-side error boundary
    not-found.tsx             Custom accessible 404 page
    globals.css               Design tokens, verdict palette, comparison diff, print stylesheet
  components/
    ComparisonView.tsx        Side-by-side contract diff, added risks, and takeaways
    DocumentQA.tsx            Interactive question answering panel with suggested prompts
    ClockHero.tsx             Prominent countdown timer for urgent running deadlines
    DeadlineList.tsx          All detected statutory clocks and calculation bases
    Findings.tsx              Clause-by-clause analysis with statutory citations
    Verdict.tsx               Accessible verdict badges (void, one_sided, standard, missing)
    Disclaimer.tsx            Legal aid guidance & NALSA helpline info
  lib/
    corpus/statutes.ts        Fixed catalogue of 15 Indian statutory provisions (EN/HI/BN)
    compare.ts                Contract comparison engine with Gemini structured diffing
    qa.ts                     Document Q&A assistant grounded in document & statute corpus
    clock.ts                  Deterministic limitation arithmetic in TypeScript (EN/HI/BN)
    gemini.ts                 Gemini SDK client with prompt injection boundary defense
    schema.ts                 Zod contracts and server-side grounding filter
    samples.ts                Multi-domain single & comparison presets + quick questions
    redact.ts                 Client-side Indian PII masking (10 identifier types)
    ratelimit.ts              Bounded sliding-window limiter with IP validation & TTL GC
    i18n/translations.ts      Full UI, clock, checklist, and comparison localization (EN/HI/BN)
tests/                        138 automated tests across 13 test files
```

---

## License

MIT License. See [LICENSE](file:///c:/Users/arpan/Downloads/pehra/LICENSE).
