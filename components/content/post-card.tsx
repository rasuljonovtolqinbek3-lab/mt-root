"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, MessageSquare, Bookmark, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    views: number;
    publishedAt: Date | null;
    author: { nickname: string };
    category?: { name: string; color: string } | null;
    _count?: { comments: number; bookmarks: number; reactions: number };
  };
  variant?: "default" | "compact" | "featured";
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  if (variant === "featured") {
    return (
      <Card className="overflow-hidden group">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <CardContent className="space-y-3">
          {post.category && (
            <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: post.category.color, backgroundColor: `${post.category.color}15` }}>
              {post.category.name}
            </span>
          )}
          <Link href={`/${post.slug}`} className="block">
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
          </Link>
          {post.excerpt && <p className="text-sm text-text-secondary line-clamp-2">{post.excerpt}</p>}
          <div className="flex items-center gap-3 text-xs text-text-muted pt-1">
            <span>{post.author.nickname}</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card hover className="overflow-hidden">
        <CardContent className="py-3">
          <div className="flex items-start gap-3">
            {post.coverImage && (
              <img src={post.coverImage} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/${post.slug}`} className="block">
                <h3 className="text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              </Link>
              <div className="flex items-center gap-2 text-[10px] text-text-muted mt-1">
                {post.category && <span style={{ color: post.category.color }}>{post.category.name}</span>}
                <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden group">
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <CardContent className="space-y-2">
        {post.category && (
          <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: post.category.color, backgroundColor: `${post.category.color}15` }}>
            {post.category.name}
          </span>
        )}
        <Link href={`/${post.slug}`} className="block">
          <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        </Link>
        {post.excerpt && <p className="text-sm text-text-secondary line-clamp-2">{post.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-text-muted pt-1">
          <span>{post.author.nickname}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
          {post._count && (
            <>
              <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post._count.comments}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post._count.reactions}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
