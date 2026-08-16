"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { LoadingPage } from "@/components/ui/loading";
import { EmptyState } from "@/components/content/empty-state";
import { Plus, Edit, Trash2, Eye, Archive } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  views: number;
  isFeatured: boolean;
  isPinned: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: { nickname: string };
  category: { name: string } | null;
  _count: { comments: number; bookmarks: number };
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/posts?limit=50")
      .then((res) => res.json())
      .then((data) => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    p.status.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <LoadingPage message="Loading posts..." />;

  return (
    <PageWrapper>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Post
          </Link>
        </div>

        <input
          type="text"
          placeholder="Filter posts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 w-full max-w-sm rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary"
        />

        {filtered.length === 0 ? (
          <EmptyState title="No posts found" description="Create your first post to get started." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Views</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Author</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{post.title}</div>
                      <div className="text-xs text-text-muted">/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{post.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === "PUBLISHED" ? "bg-accent-green/10 text-accent-green" :
                        post.status === "DRAFT" ? "bg-accent-yellow/10 text-accent-yellow" :
                        "bg-text-muted/10 text-text-muted"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{post.views}</td>
                    <td className="px-4 py-3 text-text-secondary">{post.author.nickname}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/${post.slug}`} className="rounded p-1.5 text-text-muted hover:text-primary hover:bg-surface transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="rounded p-1.5 text-text-muted hover:text-accent-yellow hover:bg-surface transition-colors" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-text-muted hover:text-accent-red hover:bg-surface transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
