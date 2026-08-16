"use client";

import Link from "next/link";
import { Hash } from "lucide-react";

interface TagListProps {
  tags: { name: string; slug: string }[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/?tag=${tag.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary hover:border-primary/30 hover:text-primary transition-colors"
        >
          <Hash className="h-3 w-3" /> {tag.name}
        </Link>
      ))}
    </div>
  );
}
