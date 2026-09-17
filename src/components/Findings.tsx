import { VerdictBadge } from "./Verdict";
import type { GroundedFinding, Language } from "@/lib/schema";
import { getStatute } from "@/lib/corpus/statutes";
import { t } from "@/lib/i18n/translations";

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
export function Findings({
  findings,
  language = "en",
}: {
  findings: readonly GroundedFinding[];
  language?: Language;
}) {
  const tr = t(language);

  if (findings.length === 0) {
    return <p className="hint">{tr.findingsEmpty}</p>;
  }

  return (
    <div className="annotated">
      {findings.map((finding, index) => {
        const noteId = `finding-note-${index}`;
        const caution = tr.confidenceNotes[finding.confidence];
        const statute = getStatute(finding.statute.id, language) ?? finding.statute;

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
                    {tr.absentProtectionAria}
                  </span>
                  {finding.clause}
                </>
              ) : (
                finding.clause
              )}
            </blockquote>

            <div className="finding-note" id={noteId}>
              <VerdictBadge verdict={finding.verdict} language={language} />
              <p>{finding.explanation}</p>
              {caution ? <p className="hint">{caution}</p> : null}
              <div className="source">
                <cite>{statute.citation}</cite>
                {statute.plain}
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  <strong>{tr.whatMeansForYou}</strong>
                  {statute.soWhat}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
