import { PageWrapper } from "@/components/layout/page-wrapper";
import { getPublishedPosts, getCategories } from "@/lib/content";
import { PostCard } from "@/components/content/post-card";
import { EmptyState } from "@/components/content/empty-state";
import { Newspaper } from "lucide-react";

export default async function NewsPage() {
  const [{ posts }, categories] = await Promise.all([
    getPublishedPosts({ type: "NEWS", limit: 20 }),
    getCategories(),
  ]);

  const newsCategory = categories.find(c => c.slug === "cyber-news");

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-accent-yellow" /> Cyber News
          </h1>
          <p className="text-text-secondary mt-1">Latest cybersecurity news and threat intelligence.</p>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            title="No news yet"
            description="Check back later for the latest cybersecurity updates."
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
