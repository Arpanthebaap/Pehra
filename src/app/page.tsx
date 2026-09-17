"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { ClockHero } from "@/components/ClockHero";
import { DeadlineList } from "@/components/DeadlineList";
import { Findings } from "@/components/Findings";
import { redact, type Redaction } from "@/lib/redact";
import { MAX_DOCUMENT_CHARS, type GroundedFinding, type Language } from "@/lib/schema";
import type { Deadline } from "@/lib/clock";
import { SAMPLE_RENT_AGREEMENT } from "@/lib/samples";
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
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [redactions, setRedactions] = useState<Redaction[]>([]);

  const textareaId = useId();
  const languageId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setBusy(true);

    // Identifiers are stripped here, in the browser, before anything is sent.
    const { text: safeText, redactions: found } = redact(text);
    setRedactions(found);

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

      setResult(payload as AnalysisResult);
      // Move focus to the results so a screen reader user lands on the answer.
      window.requestAnimationFrame(() => resultsRef.current?.focus());
    } catch {
      setError(
        "Pehra could not reach the server. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }, [text, language]);

  const tooShort = text.trim().length > 0 && text.trim().length < 40;
  const tooLong = text.length > MAX_DOCUMENT_CHARS;
  const tr = t(language);

  return (
    <div className="shell">
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

      <main id="main">
        <section className="section" style={{ marginTop: "2rem" }}>
          <h2>{tr.formHeading}</h2>
          <p className="hint">{tr.formHint}</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1.25rem 0 0.5rem" }}>
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
            <button
              type="button"
              onClick={() => {
                setText(SAMPLE_RENT_AGREEMENT);
                setResult(null);
                setError(null);
              }}
            >
              {tr.btnExample}
            </button>
            <span className="counter" aria-live="polite">
              {text.length.toLocaleString("en-IN")} / {MAX_DOCUMENT_CHARS.toLocaleString("en-IN")} {tr.characters}
              {tooShort ? tr.tooShort : ""}
              {tooLong ? tr.tooLong : ""}
            </span>
          </div>
        </section>

        <Disclaimer language={language} />

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
            </>
          ) : null}
        </div>
      </main>

      <footer>
        <p>{tr.footerText}</p>
      </footer>
    </div>
  );
}
