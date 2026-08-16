"use client";

import { useAuth } from "./auth-provider";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, User, Settings, Shield, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UserButton() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 hover:border-primary/30 transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <img src={user.avatar || ""} alt={user.nickname} className="h-6 w-6 rounded-full" />
        <span className="text-sm font-medium text-text-primary hidden sm:inline">{user.nickname}</span>
        {user.level && <span className="text-xs text-primary hidden md:inline">L{user.level.number}</span>}
        <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden sm:inline" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface elevated shadow-glow-cyan py-1 z-50"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-text-primary">{user.nickname}</p>
              <p className="text-xs text-text-muted">{user.level?.name || "Newbie"} • {user.xp} XP</p>
            </div>
            <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setOpen(false)} role="menuitem">
              <User className="h-4 w-4" /> Profile
            </Link>
            {["ADMIN", "SUPER_ADMIN"].includes(user.role) && (
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setOpen(false)} role="menuitem">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            <Link href="/profile/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-primary transition-colors" onClick={() => setOpen(false)} role="menuitem">
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button onClick={() => { setOpen(false); logout(); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-accent-red transition-colors" role="menuitem">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
