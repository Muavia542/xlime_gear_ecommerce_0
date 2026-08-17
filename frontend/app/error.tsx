"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("XLIME frontend error:", error);
  }, [error]);

  return (
    <main className="section">
      <div
        className="wrap form-card"
        style={{
          maxWidth: 720,
          marginTop: 80,
          marginBottom: 80,
        }}
      >
        <span className="eyebrow">Something went wrong</span>

        <h1 className="page-title">
          Please try again
        </h1>

        <p className="muted" style={{ marginBottom: 24 }}>
          We could not load this section of XLIME GEAR.
        </p>

        <button
          type="button"
          className="btn primary"
          onClick={() => reset()}
        >
          Retry
        </button>
      </div>
    </main>
  );
}