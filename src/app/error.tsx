"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[pehra] runtime error boundary caught:", error);
  }, [error]);

  return (
    <div className="shell" style={{ marginTop: "4rem" }}>
      <header className="masthead">
        <h1 className="wordmark">
          <span className="devanagari" lang="hi">पहरा</span>
          Pehra
        </h1>
      </header>

      <main id="main">
        <div className="notice error" role="alert" style={{ marginTop: "2rem" }}>
          <h2>Something went wrong</h2>
          <p>
            An unexpected error occurred while rendering the application. Your document
            and data have not been compromised or stored.
          </p>
          <button
            type="button"
            className="primary"
            onClick={() => reset()}
            style={{ marginTop: "1rem" }}
          >
            Try again
          </button>
        </div>
      </main>
    </div>
  );
}
