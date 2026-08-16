"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Locale = "uz" | "ru" | "en";

const locales: { id: Locale; label: string; flag: string }[] = [
  { id: "uz", label: "O'zbek", flag: "🇺🇿" },
  { id: "ru", label: "Русский", flag: "🇷🇺" },
  { id: "en", label: "English", flag: "🇬🇧" },
];

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

export function LanguageSwitcher() {
  const [locale, setLocaleState] = useState<Locale>("uz");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getCookie("mt_locale") as Locale | null;
    if (saved && locales.some((l) => l.id === saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("mt_locale", newLocale);
    setOpen(false);
    // In a full i18n implementation, this would trigger a page reload or router push
    // For Phase 3, we persist the preference and update UI state
    window.location.reload();
  };

  const current = locales.find((l) => l.id === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-medium hidden sm:inline">{current?.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-surface elevated shadow-glow-cyan py-1 z-50"
          >
            {locales.map((l) => (
              <button
                key={l.id}
                onClick={() => setLocale(l.id)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2 text-sm transition-colors",
                  locale === l.id
                    ? "text-primary bg-primary/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span> {l.label}
                </span>
                {locale === l.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
