"use client";

import { useCallback, useState } from "react";
import type { Language } from "@/lib/schema";
import type { QAResponse } from "@/lib/qa";
import { QUICK_QUESTIONS, type QuickQuestion } from "@/lib/samples";
import { t } from "@/lib/i18n/translations";

interface DocumentQAProps {
  documentText: string;
  language: Language;
}

export function DocumentQA({ documentText, language }: DocumentQAProps) {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qaResult, setQaResult] = useState<QAResponse | null>(null);

  const tr = t(language);

  const askQuestion = useCallback(
    async (qToAsk?: string) => {
      const q = (qToAsk ?? question).trim();
      if (!q || q.length < 5 || busy) return;

      setError(null);
      setBusy(true);

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentText,
            question: q,
            language,
          }),
        });

        const data: unknown = await res.json();

        if (!res.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof (data as { error: unknown }).error === "string"
              ? (data as { error: string }).error
              : "Could not answer question at this time.";
          setError(message);
          return;
        }

        setQaResult(data as QAResponse);
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setBusy(false);
      }
    },
    [documentText, question, language, busy],
  );

  const handleQuickQuestion = (quick: QuickQuestion) => {
    const qText = quick.question[language];
    setQuestion(qText);
    void askQuestion(qText);
  };

  return (
    <section className="section qa-section" role="region" aria-label={tr.qaTitle}>
      <h2>💬 {tr.qaTitle}</h2>
      <p className="hint">{tr.qaHint}</p>

      <div className="qa-quick-container">
        <span className="qa-quick-label">{tr.quickQuestionsLabel}</span>
        <div className="qa-chips" role="group" aria-label={tr.quickQuestionsLabel}>
          {QUICK_QUESTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="qa-chip"
              onClick={() => handleQuickQuestion(item)}
              disabled={busy}
            >
              {item.label[language]}
            </button>
          ))}
        </div>
      </div>

      <div className="qa-input-row">
        <input
          type="text"
          className="qa-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={tr.qaPlaceholder}
          aria-label={tr.qaTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void askQuestion();
            }
          }}
        />
        <button
          type="button"
          className="primary btn-ask"
          onClick={() => void askQuestion()}
          disabled={busy || question.trim().length < 5}
        >
          {busy ? tr.btnAsking : tr.btnAsk}
        </button>
      </div>

      <div aria-live="polite" aria-busy={busy}>
        {busy ? <p className="hint">{tr.btnAsking}</p> : null}

        {error ? (
          <div className="notice error" role="alert" style={{ marginTop: "1rem" }}>
            <p>{error}</p>
          </div>
        ) : null}

        {qaResult ? (
          <article className="qa-answer-card">
            <h3 className="qa-answer-heading">⚖️ {tr.qaTitle}</h3>
            <p className="qa-answer-body">{qaResult.answer}</p>

            {qaResult.citedClauses && qaResult.citedClauses.length > 0 ? (
              <div className="qa-clauses-box">
                <span className="qa-meta-title">{tr.qaRelevantClauses}:</span>
                <ul className="plain">
                  {qaResult.citedClauses.map((clause, idx) => (
                    <li key={idx} className="qa-clause-item">
                      &ldquo;{clause}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {qaResult.statute ? (
              <div className="qa-statute-box">
                <span className="qa-meta-title">{tr.qaStatuteHeading}:</span>
                <p className="qa-statute-info">
                  <strong>{qaResult.statute.title}</strong> ({qaResult.statute.citation})
                </p>
                <p className="qa-statute-takeaway">{qaResult.explanation}</p>
              </div>
            ) : null}

            {qaResult.legalAidGuidance ? (
              <div className="qa-legalaid-box">
                <span className="qa-meta-title">🏛️ {tr.qaLegalAidHeading}:</span>
                <p className="qa-legalaid-info">{qaResult.legalAidGuidance}</p>
              </div>
            ) : null}
          </article>
        ) : null}
      </div>
    </section>
  );
}
