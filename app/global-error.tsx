"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="bg-background text-text-primary flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Critical Error</h1>
          <p className="text-text-secondary">The application encountered a critical error.</p>
          <button
            onClick={reset}
            className="rounded-lg bg-primary/10 px-6 py-2 text-sm text-primary border border-primary/20"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
