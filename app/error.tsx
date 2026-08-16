"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center rounded-2xl bg-accent-red/10 p-4">
          <AlertTriangle className="h-10 w-10 text-accent-red" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Something went wrong</h1>
        <p className="text-text-secondary max-w-md mx-auto">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors border border-primary/20"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </motion.div>
    </div>
  );
}
