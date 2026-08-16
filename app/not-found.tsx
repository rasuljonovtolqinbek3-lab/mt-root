"use client";

import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4">
          <Terminal className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-gradient">404</h1>
        <p className="text-lg text-text-secondary">Page not found in the network.</p>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          The resource you are looking for does not exist or has been moved to a different location.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors border border-primary/20"
        >
          <ArrowLeft className="h-4 w-4" /> Return Home
        </Link>
      </motion.div>
    </div>
  );
}
