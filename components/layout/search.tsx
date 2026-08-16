"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Command, FileText, User, Trophy, Flag, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const searchCategories = [
  { id: "articles", label: "Articles", icon: FileText },
  { id: "users", label: "Users", icon: User },
  { id: "competitions", label: "Competitions", icon: Trophy },
  { id: "ctf", label: "CTF", icon: Flag },
  { id: "problems", label: "Problems", icon: Code2 },
];

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("articles");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted hover:border-primary/30 hover:text-text-secondary transition-colors"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
          <Command className="h-3 w-3" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-xl mx-4 rounded-xl border border-border bg-surface elevated shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, users, competitions..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-text-muted hover:text-text-primary">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
                  ESC
                </kbd>
              </div>

              {/* Categories */}
              <div className="flex gap-1 border-b border-border px-3 py-2 overflow-x-auto">
                {searchCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                        activeCategory === cat.id
                          ? "bg-primary/10 text-primary"
                          : "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" /> {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Results / Empty */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {query.length > 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-text-muted">Search backend coming in Phase 4</p>
                    <p className="text-xs text-text-disabled mt-1">Query: &quot;{query}&quot; in {activeCategory}</p>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <Search className="mx-auto h-8 w-8 text-text-disabled" />
                    <p className="text-sm text-text-muted">Start typing to search</p>
                    <p className="text-xs text-text-disabled">Articles, users, competitions, CTF, problems</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
