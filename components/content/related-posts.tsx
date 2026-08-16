"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  author: { nickname: string };
  category?: { name: string; color: string } | null;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-bold text-text-primary mb-4">Related Articles</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} hover className="overflow-hidden">
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
              </div>
            )}
            <CardContent className="py-3">
              {post.category && (
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: post.category.color }}>
                  {post.category.name}
                </span>
              )}
              <Link href={`/${post.slug}`} className="block mt-1">
                <h3 className="text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              </Link>
              <p className="text-xs text-text-muted mt-1">{post.author.nickname}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
