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
          <p className="tagline">
            Read the paperwork before it reads you. Built for India.
          </p>
        </div>

        <div className="masthead-tools">
          <span id="textsize-label" className="visually-hidden">
            Text size
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
          <h2>What are you being asked to sign?</h2>
          <p className="hint">
            Paste a rent agreement, a job contract, a loan document, an app&rsquo;s
            terms, or a legal notice you have received. Pehra reads it against
            Indian law and tells you three things: which clauses cannot bind you,
            which protections are missing, and which deadlines are already
            running against you.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1.25rem 0 0.5rem" }}>
            <div>
              <label htmlFor={languageId}>Answer me in</label>
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
            The document
          </label>
          <textarea
            id={textareaId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste the text here."
            aria-describedby={`${textareaId}-help`}
            spellCheck={false}
          />
          <p id={`${textareaId}-help`} className="hint">
            Nothing you paste is stored. Aadhaar numbers, PAN, phone numbers,
            email addresses and account numbers are masked in your browser before
            the text is sent anywhere. Pattern matching is not perfect, so remove
            anything you would not want read by a stranger.
          </p>

          <div className="actions">
            <button
              type="button"
              className="primary"
              onClick={() => void analyse()}
              disabled={busy || tooShort || tooLong || text.trim().length === 0}
            >
              {busy ? "Reading…" : "Read this document"}
            </button>
            <button
              type="button"
              onClick={() => {
                setText(SAMPLE_RENT_AGREEMENT);
                setResult(null);
                setError(null);
              }}
            >
              Load an example
            </button>
            <span className="counter" aria-live="polite">
              {text.length.toLocaleString("en-IN")} / {MAX_DOCUMENT_CHARS.toLocaleString("en-IN")} characters
              {tooShort ? " — too short to read" : ""}
              {tooLong ? " — too long, paste the parts you are worried about" : ""}
            </span>
          </div>
        </section>

        <Disclaimer />

        <div
          ref={resultsRef}
          tabIndex={-1}
          aria-live="polite"
          aria-busy={busy}
          style={{ outline: "none" }}
        >
          {busy ? <p className="hint">Reading the document against Indian law…</p> : null}

          {error ? (
            <div className="notice error" role="alert">
              <h2 style={{ fontSize: "1.0625rem" }}>Pehra stopped</h2>
              <p>{error}</p>
            </div>
          ) : null}

          {result ? (
            <>
              {result.urgent ? <ClockHero deadline={result.urgent} /> : null}

              <section className="section">
                <h2>What this document is</h2>
                <p>{result.summary}</p>
                <button type="button" onClick={speak}>
                  Read this aloud
                </button>
              </section>

              {redactions.length > 0 ? (
                <p className="hint">
                  Masked before sending:{" "}
                  {redactions.map((r) => `${r.count} × ${r.label}`).join(", ")}.
                </p>
              ) : null}

              <section className="section">
                <h2>Clause by clause</h2>
                <p className="hint">
                  Struck-through backgrounds mark protections that are absent
                  from the document rather than present in it.
                </p>
                <Findings findings={result.findings} />
                {result.ungroundedClaimsDiscarded > 0 ? (
                  <p className="hint">
                    Pehra dropped {result.ungroundedClaimsDiscarded} finding
                    {result.ungroundedClaimsDiscarded === 1 ? "" : "s"} it could
                    not tie to a specific provision. It would rather say less
                    than say something you might act on and find is not the law.
                  </p>
                ) : null}
              </section>

              <section className="section">
                <h2>Clocks that are already running</h2>
                <DeadlineList deadlines={result.deadlines} />
              </section>

              <section className="section">
                <h2>Take these questions to a lawyer</h2>
                <p className="hint">
                  Legal aid is free if you qualify under s. 12 of the Legal
                  Services Authorities Act. Walk into the District Legal Services
                  Authority at your district court, or call 15100.
                </p>
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
        <p>
          Pehra reads against a fixed corpus of Indian statutory provisions and
          cites every one of them. It never stores your document. Analysis is
          generated by Google Gemini and constrained to that corpus.
        </p>
      </footer>
    </div>
  );
}
