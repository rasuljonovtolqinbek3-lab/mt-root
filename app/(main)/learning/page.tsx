import { PageWrapper } from "@/components/layout/page-wrapper";
import { getPublishedPosts, getCategories } from "@/lib/content";
import { PostCard } from "@/components/content/post-card";
import { EmptyState } from "@/components/content/empty-state";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function LearningPage() {
  const [{ posts }, categories] = await Promise.all([
    getPublishedPosts({
      type: undefined,
      limit: 20,
      sortBy: "newest",
    }),
    getCategories(),
  ]);

  const learningCategories = categories.filter(c =>
    ["tutorials", "courses", "pentesting", "red-team", "blue-team", "web-security", "network-security", "wifi-security", "osint", "linux", "kali-linux", "malware", "cloud-security", "ai-security"].includes(c.slug)
  );

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Learning
          </h1>
          <p className="text-text-secondary mt-1">Tutorials, courses, and educational content.</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/learning"
            className="rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20"
          >
            All
          </Link>
          {learningCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/learning?category=${cat.slug}`}
              className="rounded-full px-3 py-1 text-xs font-medium border border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-primary transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <EmptyState
            title="No content yet"
            description="Learning materials will be published soon."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
