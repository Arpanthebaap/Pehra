import { VerdictBadge } from "./Verdict";
import type { GroundedFinding } from "@/lib/schema";

const CONFIDENCE_NOTE: Record<GroundedFinding["confidence"], string | null> = {
  high: null,
  medium: "Pehra is fairly sure about this one, but check it with a lawyer.",
  low: "Pehra is unsure about this one. Treat it as a question to ask, not a fact.",
};

/**
 * Findings are laid out as marginalia: the clause on the left, the note in the
 * margin beside it - the way a lawyer marks up a document by hand. On narrow
 * screens the note drops directly beneath the clause it belongs to, so the
 * pairing survives the reflow.
 *
 * Every note carries its source in full. A reader who does not trust Pehra
 * should be able to go and check, and finding the provision should not require
 * trusting Pehra a second time.
 */
export function Findings({ findings }: { findings: readonly GroundedFinding[] }) {
  if (findings.length === 0) {
    return (
      <p className="hint">
        Pehra found nothing in this text that it could tie to a provision it
        knows. That is not a clean bill of health - it may mean the document
        falls outside what Pehra covers. Take it to a legal aid lawyer.
      </p>
    );
  }

  return (
    <div className="annotated">
      {findings.map((finding, index) => {
        const noteId = `finding-note-${index}`;
        const caution = CONFIDENCE_NOTE[finding.confidence];

        return (
          <article
            className="finding"
            data-verdict={finding.verdict}
            key={`${finding.statute.id}-${index}`}
          >
            <blockquote className="finding-clause" aria-describedby={noteId}>
              {finding.verdict === "missing" ? (
                <>
                  <span className="visually-hidden">
                    Not present in the document:
                  </span>
                  {finding.clause}
                </>
              ) : (
                finding.clause
              )}
            </blockquote>

            <div className="finding-note" id={noteId}>
              <VerdictBadge verdict={finding.verdict} />
              <p>{finding.explanation}</p>
              {caution ? <p className="hint">{caution}</p> : null}
              <div className="source">
                <cite>{finding.statute.citation}</cite>
                {finding.statute.plain}
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  <strong>What that means for you: </strong>
                  {finding.statute.soWhat}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
