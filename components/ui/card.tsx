import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "ghost";
  hover?: boolean;
}

export function Card({ children, className, variant = "default", hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300",
        variant === "default" && "border-border bg-surface",
        variant === "elevated" && "border-border bg-surface elevated shadow-lg",
        variant === "ghost" && "border-transparent bg-transparent",
        hover && "hover:border-primary/20 hover:shadow-glow-cyan/10 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("px-5 py-4 border-b border-border", className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn("text-base font-semibold text-text-primary", className)}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn("text-sm text-text-muted mt-1", className)}>{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn("px-5 py-3 border-t border-border flex items-center gap-3", className)}>{children}</div>;
}

// Content Card — for articles/posts
interface ContentCardProps {
  title: string;
  description?: string;
  category?: string;
  categoryColor?: string;
  author?: string;
  date?: string;
  views?: number;
  reactions?: number;
  comments?: number;
  className?: string;
}

export function ContentCard({
  title,
  description,
  category,
  categoryColor = "#00f0ff",
  author,
  date,
  views,
  reactions,
  comments,
  className,
}: ContentCardProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-3">
        {category && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: categoryColor, backgroundColor: `${categoryColor}15` }}
          >
            {category}
          </span>
        )}
        <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-2">{title}</h3>
        {description && <p className="text-sm text-text-secondary line-clamp-2">{description}</p>}
        <div className="flex items-center gap-3 text-xs text-text-muted pt-1">
          {author && <span>{author}</span>}
          {date && <span>{date}</span>}
          {views !== undefined && <span>{views} views</span>}
          {reactions !== undefined && <span>{reactions} reactions</span>}
          {comments !== undefined && <span>{comments} comments</span>}
        </div>
      </CardContent>
    </Card>
  );
}
