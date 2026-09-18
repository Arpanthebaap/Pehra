"use client";

import type { ComparisonResult } from "@/lib/compare";
import type { Language } from "@/lib/schema";
import { t } from "@/lib/i18n/translations";
import { VerdictBadge } from "./Verdict";

interface ComparisonViewProps {
  result: ComparisonResult;
  language: Language;
}

export function ComparisonView({ result, language }: ComparisonViewProps) {
  const tr = t(language);

  const deltaVariant =
    result.riskDelta === "higher_risk"
      ? "risk-badge-high"
      : result.riskDelta === "improved"
      ? "risk-badge-low"
      : "risk-badge-neutral";

  return (
    <div className="comparison-view" role="region" aria-label={tr.compareHeading}>
      <div className="comparison-header">
        <span className={`risk-delta-badge ${deltaVariant}`}>
          {tr.riskDeltaLabels[result.riskDelta]}
        </span>
        <h2 style={{ margin: "0.75rem 0 0.25rem" }}>{tr.compareHeading}</h2>
      </div>

      <section className="section" style={{ marginTop: "1rem" }}>
        <h3>{tr.summaryHeading}</h3>
        <p>{result.summary}</p>
      </section>

      {result.keyTakeaway ? (
        <div className="notice takeaway-card" role="note">
          <h4 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>
            💡 {tr.keyTakeawayHeading}
          </h4>
          <p style={{ margin: 0 }}>{result.keyTakeaway}</p>
        </div>
      ) : null}

      <section className="section" style={{ marginTop: "1.5rem" }}>
        <h3>{tr.clausesHeading} ({result.changes.length})</h3>
        <div className="changes-list">
          {result.changes.map((change, idx) => (
            <article
              key={`${change.statute.id}-${idx}`}
              className={`change-card change-${change.category}`}
            >
              <div className="change-meta">
                <span className="change-category-tag">
                  {tr.changeCategoryLabels[change.category]}
                </span>
                <VerdictBadge verdict={change.verdict} language={language} />
              </div>

              <div className="change-diff-grid">
                {change.originalClause ? (
                  <div className="clause-col clause-original">
                    <span className="diff-label">Original (Version A)</span>
                    <blockquote className="diff-quote">{change.originalClause}</blockquote>
                  </div>
                ) : null}

                {change.modifiedClause ? (
                  <div className="clause-col clause-modified">
                    <span className="diff-label">Modified (Version B)</span>
                    <blockquote className="diff-quote">{change.modifiedClause}</blockquote>
                  </div>
                ) : null}
              </div>

              <div className="change-statute-note">
                <p className="statute-cite">
                  <strong>{change.statute.title}</strong> — {change.statute.citation}
                </p>
                <p className="change-explanation">
                  <strong>{tr.whatMeansForYou}</strong>
                  {change.explanation}
                </p>
              </div>
            </article>
          ))}
        </div>

        {result.ungroundedChangesDiscarded > 0 ? (
          <p className="hint">
            {tr.discardedHint(result.ungroundedChangesDiscarded)}
          </p>
        ) : null}
      </section>
    </div>
  );
}
