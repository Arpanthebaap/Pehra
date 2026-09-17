import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell" style={{ marginTop: "4rem" }}>
      <header className="masthead">
        <h1 className="wordmark">
          <span className="devanagari" lang="hi">पहरा</span>
          Pehra
        </h1>
      </header>

      <main id="main">
        <div className="section" style={{ marginTop: "2rem" }}>
          <h2>Page Not Found</h2>
          <p className="hint">
            The page you are looking for does not exist. Pehra operates as a single-page
            watchkeeper for legal paperwork.
          </p>
          <p>
            <Link href="/" className="primary" style={{ display: "inline-block", padding: "0.5rem 1rem", background: "var(--stamp)", color: "#fff", textDecoration: "none", borderRadius: "2px" }}>
              Return to Pehra
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
