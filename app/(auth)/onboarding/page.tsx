"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { Terminal, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["CyberWolf", "RootX", "Shadow", "NullPtr", "HexHunter", "BitPhantom"];

export default function OnboardingPage() {
  const { login } = useAuth();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nickname.trim()) return;

    setLoading(true);
    const result = await login(nickname.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error || "error");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-xl shadow-glow-cyan",
          shake && "animate-shake"
        )}
      >
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
            <Terminal className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            MT_ROOT<span className="text-primary animate-terminal-blink">_</span>
          </h1>
          <p className="mt-2 text-text-secondary">Enter the network.</p>
          <p className="mt-1 text-sm text-text-muted">Choose your anonymous identity.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Your nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setError(""); }}
              placeholder="e.g. CyberWolf"
              maxLength={20}
              className={cn(
                "w-full rounded-lg border bg-background-secondary px-4 py-3 text-text-primary outline-none transition-all placeholder:text-text-disabled",
                error ? "border-accent-red focus:border-accent-red focus:ring-1 focus:ring-accent-red/30" : "border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              )}
            />
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-sm text-accent-red">
                  {error === "nickname_too_short" && "Minimum 3 characters"}
                  {error === "nickname_too_long" && "Maximum 20 characters"}
                  {error === "nickname_invalid_chars" && "Only letters, numbers, and underscore"}
                  {error === "nickname_reserved" && "This nickname is reserved"}
                  {error === "nickname_taken" && "This nickname is already taken"}
                  {error === "rate_limit_exceeded" && "Too many attempts. Please wait."}
                  {error === "user_banned" && "This account has been banned"}
                  {!error.startsWith("nickname_") && error !== "rate_limit_exceeded" && error !== "user_banned" && "An error occurred"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={loading || nickname.length < 3}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-background transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-background/30 border-t-background" /> : <>Enter MT_ROOT <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => { setNickname(s); setError(""); }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background-secondary px-2.5 py-1.5 text-xs text-text-secondary hover:border-primary/30 hover:text-primary transition-colors">
                <Sparkles className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">No email or password required. Your identity is anonymous.</p>
      </motion.div>
    </div>
  );
}
