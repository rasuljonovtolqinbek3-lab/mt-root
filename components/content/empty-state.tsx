"use client";

import { FileX, Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "file" | "search";
}

export function EmptyState({
  title = "No content found",
  description = "There is nothing to display here yet.",
  icon = "file",
}: EmptyStateProps) {
  const Icon = icon === "search" ? Search : FileX;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-2xl bg-surface p-4">
        <Icon className="h-8 w-8 text-text-disabled" />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-muted max-w-sm">{description}</p>
    </div>
  );
}
