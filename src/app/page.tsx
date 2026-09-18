"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { ClockHero } from "@/components/ClockHero";
import { DeadlineList } from "@/components/DeadlineList";
import { Findings } from "@/components/Findings";
import { ComparisonView } from "@/components/ComparisonView";
import { DocumentQA } from "@/components/DocumentQA";
import { redact, type Redaction } from "@/lib/redact";
import { MAX_DOCUMENT_CHARS, type GroundedFinding, type Language } from "@/lib/schema";
import type { Deadline } from "@/lib/clock";
import type { ComparisonResult } from "@/lib/compare";
import { SAMPLE_DOCUMENTS, COMPARISON_SAMPLES } from "@/lib/samples";
import { t } from "@/lib/i18n/translations";

interface AnalysisResult {
  documentKind: string;
  summary: string;
  findings: GroundedFinding[];
  deadlines: Deadline[];
  urgent: Deadline | null;
  questionsForALawyer: string[];
  ungroundedClaimsDiscarded: number;
  analysedOn: string;
}

type TextSize = "normal" | "large" | "xlarge";
type ActiveMode = "analyze" | "compare";

const LANGUAGE_OPTIONS: ReadonlyArray<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "bn", label: "বাংলা" },
];

const SPEECH_LOCALE: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
};

export default function Home() {
  const [activeMode, setActiveMode] = useState<ActiveMode>("analyze");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [redactions, setRedactions] = useState<Redaction[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);

  // Comparison mode state
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [compareBusy, setCompareBusy] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // High efficiency client-side memoization caches
  const analysisCache = useRef<Map<string, AnalysisResult>>(new Map());
  const comparisonCache = useRef<Map<string, ComparisonResult>>(new Map());

  const textareaId = useId();
  const origTextareaId = useId();
  const modTextareaId = useId();
  const languageId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);
  const compResultsRef = useRef<HTMLDivElement>(null);

  const changeTextSize = useCallback((size: TextSize) => {
    setTextSize(size);
    document.documentElement.dataset["textsize"] = size;
  }, []);

  const speak = useCallback(() => {
    if (!result || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.summary);
    utterance.lang = SPEECH_LOCALE[language];
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }, [result, language]);

  const analyse = useCallback(async () => {
    setError(null);
    setResult(null);

    const { text: safeText, redactions: found } = redact(text);
    setRedactions(found);

    const cacheKey = `${language}:${safeText}`;
    if (analysisCache.current.has(cacheKey)) {
      setResult(analysisCache.current.get(cacheKey)!);
      window.requestAnimationFrame(() => resultsRef.current?.focus());
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: safeText,
          language,
          today: new Date().toISOString().slice(0, 10),
        }),
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Pehra could not read that document.";
        setError(message);
        return;
      }

      const res = payload as AnalysisResult;
      analysisCache.current.set(cacheKey, res);
      setResult(res);
      window.requestAnimationFrame(() => resultsRef.current?.focus());
    } catch {
      setError("Pehra could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }, [text, language]);

  const compare = useCallback(async () => {
    setCompareError(null);
    setComparisonResult(null);

    const { text: safeOrig } = redact(originalText);
    const { text: safeMod } = redact(modifiedText);

    const cacheKey = `${language}:${safeOrig}:::${safeMod}`;
    if (comparisonCache.current.has(cacheKey)) {
      setComparisonResult(comparisonCache.current.get(cacheKey)!);
      window.requestAnimationFrame(() => compResultsRef.current?.focus());
      return;
    }

    setCompareBusy(true);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: safeOrig,
          modifiedText: safeMod,
          language,
        }),
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Pehra could not compare those documents.";
        setCompareError(message);
        return;
      }

      const res = payload as ComparisonResult;
      comparisonCache.current.set(cacheKey, res);
      setComparisonResult(res);
      window.requestAnimationFrame(() => compResultsRef.current?.focus());
    } catch {
      setCompareError("Pehra could not reach the server. Check your connection and try again.");
    } finally {
      setCompareBusy(false);
    }
  }, [originalText, modifiedText, language]);

  const loadSample = useCallback((sampleText: string) => {
    setText(sampleText);
    setResult(null);
    setError(null);
  }, []);

  const loadComparisonSample = useCallback((orig: string, mod: string) => {
    setOriginalText(orig);
    setModifiedText(mod);
    setComparisonResult(null);
    setCompareError(null);
  }, []);

  const counts = useMemo(() => {
    const c = { void: 0, one_sided: 0, standard: 0, missing: 0 };
    if (!result) return c;
    for (const f of result.findings) {
      if (f.verdict in c) c[f.verdict as keyof typeof c] += 1;
    }
    return c;
  }, [result]);

  const copyBriefing = useCallback(async () => {
    if (!result) return;
    const lines: string[] = [
      `=== PEHRA LEGAL AID INTAKE BRIEFING ===`,
      `Date: ${result.analysedOn}`,
      `Document Kind: ${result.documentKind}`,
      ``,
      `SUMMARY:`,
      result.summary,
      ``,
    ];

    if (result.urgent) {
      lines.push(
        `URGENT STATUTORY DEADLINE:`,
        `${result.urgent.action} (${result.urgent.daysRemaining} days remaining - target: ${result.urgent.dueDate})`,
        `Basis: ${result.urgent.basis}`,
        ``,
      );
    }

    const criticalFindings = result.findings.filter(
      (f) => f.verdict === "void" || f.verdict === "missing" || f.verdict === "one_sided",
    );
    if (criticalFindings.length > 0) {
      lines.push(`KEY CLAUSES & STATUTORY CITATIONS:`);
      for (const f of criticalFindings) {
        lines.push(`- [${f.verdict.toUpperCase()}] ${f.clause}`);
        lines.push(`  Citation: ${f.statute.citation} (${f.statute.title})`);
        lines.push(`  Takeaway: ${f.explanation}`);
      }
      lines.push(``);
    }

    if (result.questionsForALawyer.length > 0) {
      lines.push(`QUESTIONS FOR LEGAL AID LAWYER:`);
      result.questionsForALawyer.forEach((q, idx) => {
        lines.push(`${idx + 1}. ${q}`);
      });
      lines.push(``);
    }

    lines.push(`NALSA Helpline: 15100 | Legal Services Authorities Act, 1987, s. 12`);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      // Fallback
    }
  }, [result]);

  const tooShort = text.trim().length > 0 && text.trim().length < 40;
  const tooLong = text.length > MAX_DOCUMENT_CHARS;
  const tr = t(language);

  return (
    <div className="shell">
      <div className="print-only-header">
        <h1>पहरा · Pehra</h1>
        <p>{tr.legalAidClinicTitle} — {result?.analysedOn ?? new Date().toISOString().slice(0, 10)}</p>
      </div>

      <header className="masthead">
        <div>
          <h1 className="wordmark">
            <span className="devanagari" lang="hi">
              पहरा
            </span>
            Pehra
          </h1>
          <p className="tagline">{tr.tagline}</p>
        </div>

        <div className="masthead-tools">
          <span id="textsize-label" className="visually-hidden">
            {tr.textSize}
          </span>
          <div role="group" aria-labelledby="textsize-label">
            {(["normal", "large", "xlarge"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => changeTextSize(size)}
                aria-pressed={textSize === size}
                style={{ marginLeft: "0.35rem" }}
              >
                {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mode Navigation Tabs */}
      <nav className="mode-nav" aria-label="Tool mode selector">
        <div className="mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "analyze"}
            className={`mode-tab-btn ${activeMode === "analyze" ? "active" : ""}`}
            onClick={() => setActiveMode("analyze")}
          >
            📄 {tr.modeAnalyze}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "compare"}
            className={`mode-tab-btn ${activeMode === "compare" ? "active" : ""}`}
            onClick={() => setActiveMode("compare")}
          >
            ⚖️ {tr.modeCompare}
          </button>
        </div>
      </nav>

      <main id="main">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0" }}>
          <div>
            <label htmlFor={languageId}>{tr.languageSelectLabel}</label>
            <select
              id={languageId}
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeMode === "analyze" ? (
          /* ================= SINGLE DOCUMENT ANALYZER ================= */
          <section className="section" style={{ marginTop: "1rem" }}>
            <h2>{tr.formHeading}</h2>
            <p className="hint">{tr.formHint}</p>

            <div className="samples-container">
              <p className="samples-label">{tr.samplesLabel}</p>
              <div className="samples-chips" role="group" aria-label={tr.samplesLabel}>
                {SAMPLE_DOCUMENTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className="sample-chip"
                    onClick={() => loadSample(sample.text)}
                    title={sample.description[language]}
                  >
                    {sample.title[language]}
                  </button>
                ))}
              </div>
            </div>

            <label htmlFor={textareaId} style={{ marginTop: "1rem" }}>
              {tr.documentLabel}
            </label>
            <textarea
              id={textareaId}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={tr.placeholder}
              aria-describedby={`${textareaId}-help`}
              spellCheck={false}
            />
            <p id={`${textareaId}-help`} className="hint">
              {tr.privacyHint}
            </p>

            <div className="actions">
              <button
                type="button"
                className="primary"
                onClick={() => void analyse()}
                disabled={busy || tooShort || tooLong || text.trim().length === 0}
              >
                {busy ? tr.btnReading : tr.btnRead}
              </button>
              <span className="counter" aria-live="polite">
                {text.length.toLocaleString("en-IN")} / {MAX_DOCUMENT_CHARS.toLocaleString("en-IN")} {tr.characters}
                {tooShort ? tr.tooShort : ""}
                {tooLong ? tr.tooLong : ""}
              </span>
            </div>
          </section>
        ) : (
          /* ================= CONTRACT COMPARISON ================= */
          <section className="section" style={{ marginTop: "1rem" }}>
            <h2>{tr.compareHeading}</h2>
            <p className="hint">{tr.compareHint}</p>

            <div className="samples-container">
              <p className="samples-label">{tr.comparePresetsLabel}</p>
              <div className="samples-chips" role="group" aria-label={tr.comparePresetsLabel}>
                {COMPARISON_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className="sample-chip"
                    onClick={() => loadComparisonSample(sample.originalText, sample.modifiedText)}
                    title={sample.description[language]}
                  >
                    {sample.title[language]}
                  </button>
                ))}
              </div>
            </div>

            <div className="compare-inputs-grid">
              <div>
                <label htmlFor={origTextareaId} style={{ marginTop: "0.5rem" }}>
                  {tr.compareOriginalLabel}
                </label>
                <textarea
                  id={origTextareaId}
                  className="compare-textarea"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="Paste original contract or standard baseline terms here..."
                  spellCheck={false}
                />
              </div>

              <div>
                <label htmlFor={modTextareaId} style={{ marginTop: "0.5rem" }}>
                  {tr.compareModifiedLabel}
                </label>
                <textarea
                  id={modTextareaId}
                  className="compare-textarea"
                  value={modifiedText}
                  onChange={(e) => setModifiedText(e.target.value)}
                  placeholder="Paste modified renewal, revised agreement, or amendment here..."
                  spellCheck={false}
                />
              </div>
            </div>

            <p className="hint" style={{ marginTop: "0.5rem" }}>
              {tr.privacyHint}
            </p>

            <div className="actions">
              <button
                type="button"
                className="primary"
                onClick={() => void compare()}
                disabled={
                  compareBusy ||
                  originalText.trim().length < 30 ||
                  modifiedText.trim().length < 30
                }
              >
                {compareBusy ? tr.btnComparing : tr.btnCompare}
              </button>
            </div>
          </section>
        )}

        <Disclaimer language={language} />

        {/* Results Area */}
        {activeMode === "analyze" ? (
          <div
            ref={resultsRef}
            tabIndex={-1}
            aria-live="polite"
            aria-busy={busy}
            style={{ outline: "none" }}
          >
            {busy ? <p className="hint">{tr.analyzingHint}</p> : null}

            {error ? (
              <div className="notice error" role="alert">
                <h2 style={{ fontSize: "1.0625rem" }}>{tr.stoppedHeading}</h2>
                <p>{error}</p>
              </div>
            ) : null}

            {result ? (
              <>
                {result.urgent ? (
                  <ClockHero deadline={result.urgent} language={language} />
                ) : null}

                {/* Actionable Legal Checklist */}
                <div className="checklist-card" role="region" aria-label={tr.checklistTitle}>
                  <h3 style={{ margin: "0 0 0.5rem" }}>{tr.checklistTitle}</h3>
                  <div className="checklist-grid">
                    <div className="checklist-stat checklist-stat-void">
                      <div className="checklist-stat-num">{counts.void}</div>
                      <div className="checklist-stat-lbl">{tr.verdictLabels.void}</div>
                    </div>
                    <div className="checklist-stat checklist-stat-onesided">
                      <div className="checklist-stat-num">{counts.one_sided}</div>
                      <div className="checklist-stat-lbl">{tr.verdictLabels.one_sided}</div>
                    </div>
                    <div className="checklist-stat checklist-stat-missing">
                      <div className="checklist-stat-num">{counts.missing}</div>
                      <div className="checklist-stat-lbl">{tr.verdictLabels.missing}</div>
                    </div>
                    <div className="checklist-stat checklist-stat-deadlines">
                      <div className="checklist-stat-num">{result.deadlines.length}</div>
                      <div className="checklist-stat-lbl">{tr.deadlinesHeading}</div>
                    </div>
                  </div>

                  <div className="export-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-print"
                      onClick={() => window.print()}
                    >
                      📄 {tr.btnExportPrint}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-copy"
                      onClick={() => void copyBriefing()}
                    >
                      📋 {tr.btnCopyBriefing}
                    </button>
                    {copiedToast ? (
                      <span className="toast-feedback" role="status">
                        ✓ {tr.copiedBriefing}
                      </span>
                    ) : null}
                  </div>
                </div>

                <section className="section">
                  <h2>{tr.summaryHeading}</h2>
                  <p>{result.summary}</p>
                  <button type="button" onClick={speak}>
                    {tr.btnSpeak}
                  </button>
                </section>

                {redactions.length > 0 ? (
                  <p className="hint">
                    {tr.maskedPrefix}
                    {redactions.map((r) => `${r.count} × ${r.label}`).join(", ")}.
                  </p>
                ) : null}

                <section className="section">
                  <h2>{tr.clausesHeading}</h2>
                  <p className="hint">{tr.clausesHint}</p>
                  <Findings findings={result.findings} language={language} />
                  {result.ungroundedClaimsDiscarded > 0 ? (
                    <p className="hint">
                      {tr.discardedHint(result.ungroundedClaimsDiscarded)}
                    </p>
                  ) : null}
                </section>

                <section className="section">
                  <h2>{tr.deadlinesHeading}</h2>
                  <DeadlineList deadlines={result.deadlines} language={language} />
                </section>

                <section className="section">
                  <h2>{tr.questionsHeading}</h2>
                  <p className="hint">{tr.legalAidHint}</p>
                  <ul className="plain">
                    {result.questionsForALawyer.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </section>

                {/* Interactive Document Q&A Section */}
                <DocumentQA documentText={text} language={language} />
              </>
            ) : null}
          </div>
        ) : (
          <div
            ref={compResultsRef}
            tabIndex={-1}
            aria-live="polite"
            aria-busy={compareBusy}
            style={{ outline: "none" }}
          >
            {compareBusy ? <p className="hint">{tr.btnComparing}</p> : null}

            {compareError ? (
              <div className="notice error" role="alert">
                <h2 style={{ fontSize: "1.0625rem" }}>{tr.stoppedHeading}</h2>
                <p>{compareError}</p>
              </div>
            ) : null}

            {comparisonResult ? (
              <ComparisonView result={comparisonResult} language={language} />
            ) : null}
          </div>
        )}
      </main>

      <footer>
        <p>{tr.footerText}</p>
      </footer>
    </div>
  );
}
