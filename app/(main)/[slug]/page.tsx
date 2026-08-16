import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPostBySlug, getRelatedPosts } from "@/lib/content";
import { sanitizeHtml, stripHtml } from "@/lib/sanitize";
import { ArticleContent } from "@/components/content/article-content";
import { ReadingProgress } from "@/components/content/reading-progress";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { TagList } from "@/components/content/tag-list";
import { RelatedPosts } from "@/components/content/related-posts";
import { ViewTracker } from "@/components/content/view-tracker";
import { formatDate } from "@/lib/utils";
import { Eye, Clock, Calendar, MessageSquare } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Not Found | MT_ROOT" };

  const description = post.metaDesc || stripHtml(post.excerpt || "").slice(0, 160) || `${post.title} - MT_ROOT`;
  const title = post.metaTitle || post.title;

  return {
    title: `${title} | MT_ROOT`,
    description,
    keywords: post.metaKeywords || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.nickname],
      images: post.ogImage || post.coverImage ? [{ url: post.ogImage || post.coverImage || "" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage || ""] : undefined,
    },
    alternates: { canonical: `https://mt-root.uz/${post.slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id, post.category?.id || null);
  const sanitizedContent = sanitizeHtml(post.content);

  return (
    <>
      <ReadingProgress />
      <ViewTracker slug={post.slug} />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Category */}
        {post.category && (
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: post.category.color, backgroundColor: `${post.category.color}15` }}
          >
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted border-y border-border py-3">
          <div className="flex items-center gap-2">
            <img src={post.author.avatar || ""} alt="" className="h-6 w-6 rounded-full" />
            <span className="text-text-secondary">{post.author.nickname}</span>
          </div>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt || post.createdAt)}</span>
          {post.readingTime && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime} min read</span>}
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} views</span>
          <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post._count.comments} comments</span>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mt-6 rounded-xl overflow-hidden border border-border">
            <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          <ArticleContent content={sanitizedContent} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8">
            <TagList tags={post.tags.map(t => t.tag)} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center gap-3">
          <BookmarkButton slug={post.slug} />
        </div>

        {/* Comments Placeholder */}
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-bold text-text-primary mb-4">Discussion</h2>
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-text-disabled mb-2" />
            <p className="text-sm text-text-muted">Comments will appear here.</p>
            <p className="text-xs text-text-disabled mt-1">Full comment system coming in Phase 5.</p>
          </div>
        </section>

        {/* Related Posts */}
        <RelatedPosts posts={related} />
      </article>
    </>
  );
}
