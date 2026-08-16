"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Track view after 3 seconds (engagement threshold)
    const timer = setTimeout(() => {
      fetch(`/api/posts/${slug}/view`, { method: "POST" }).catch(() => {});
    }, 3000);
    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
