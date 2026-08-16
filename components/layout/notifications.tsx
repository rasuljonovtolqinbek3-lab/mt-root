"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-md p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-surface elevated shadow-glow-cyan overflow-hidden z-50"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
              <button className="text-text-muted hover:text-text-primary transition-colors" aria-label="Notification settings">
                <Settings className="h-4 w-4" />
              </button>
            </div>
            <div className="py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-text-disabled mb-2" />
              <p className="text-sm text-text-muted">No new notifications.</p>
              <p className="text-xs text-text-disabled mt-1">Real-time notifications coming soon.</p>
            </div>
            <div className="border-t border-border px-4 py-2">
              <button className="flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors">
                <Check className="h-3.5 w-3.5" /> Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
