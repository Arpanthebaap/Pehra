/**
 * Shown on every screen, not behind a dismiss button.
 *
 * The scope note matters as much as the caveat: telling someone what the tool
 * *is* for is what stops them treating it as something it is not.
 */
export function Disclaimer() {
  return (
    <aside className="notice" aria-labelledby="disclaimer-heading">
      <h2 id="disclaimer-heading" style={{ fontSize: "1.0625rem" }}>
        Pehra is not your lawyer
      </h2>
      <p>
        This is legal information, not legal advice. Pehra reads your document
        against a fixed set of Indian statutory provisions and shows you what it
        finds. It does not know your full situation, your State&rsquo;s local
        law, or anything that is not on the page you gave it.
      </p>
      <p>
        Free legal aid is a right, not a favour. Your District Legal Services
        Authority sits in the district court complex, and the NALSA helpline is{" "}
        <strong>15100</strong>.
      </p>
    </aside>
  );
}
