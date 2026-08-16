import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-[3px]",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary/30 border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-text-muted animate-pulse">{message}</p>
    </div>
  );
}

interface LoadingCardProps {
  count?: number;
}

export function LoadingCards({ count = 3 }: LoadingCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="h-4 w-20 rounded-full bg-surface-hover animate-pulse" />
          <div className="h-5 w-full rounded bg-surface-hover animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-surface-hover animate-pulse" />
          <div className="h-3 w-full rounded bg-surface-hover animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-surface-hover animate-pulse" />
        </div>
      ))}
    </div>
  );
}
