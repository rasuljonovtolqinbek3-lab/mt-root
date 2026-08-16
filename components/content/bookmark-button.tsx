"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({ slug, initialBookmarked = false }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check bookmark status on mount
    fetch(`/api/posts/${slug}/bookmark`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => { if (data.bookmarked !== undefined) setBookmarked(data.bookmarked); })
      .catch(() => {});
  }, [slug]);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}/bookmark`, {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 401) {
        // Redirect to onboarding if not authenticated
        window.location.href = "/onboarding";
        return;
      }
      const data = await res.json();
      if (data.bookmarked !== undefined) setBookmarked(data.bookmarked);
    } catch {
      // Network error, silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        bookmarked
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-surface text-text-secondary hover:text-text-primary hover:border-primary/20"
      )}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
