import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserBookmarks } from "@/lib/content";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { PostCard } from "@/components/content/post-card";
import { EmptyState } from "@/components/content/empty-state";
import { Bookmark } from "lucide-react";

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");

  const bookmarks = await getUserBookmarks(user.id);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" /> My Bookmarks
          </h1>
          <p className="text-text-secondary mt-1">Your saved articles and resources.</p>
        </div>

        {bookmarks.length === 0 ? (
          <EmptyState
            title="No bookmarks yet"
            description="Save articles you find useful and they will appear here."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <PostCard key={bookmark.id} post={bookmark.post} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
