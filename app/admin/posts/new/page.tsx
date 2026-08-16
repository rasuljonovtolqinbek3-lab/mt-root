"use client";

import { useState, useEffect } from "react";
import { generateSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      setForm(prev => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    type: "ARTICLE",
    status: "DRAFT",
    categoryId: "",
    tags: "",
    isFeatured: false,
    isPinned: false,
    metaTitle: "",
    metaDesc: "",
  });

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        router.push("/admin/posts");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create post");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/posts" className="rounded p-1.5 text-text-muted hover:text-text-primary hover:bg-surface transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">New Post</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              placeholder="Post title"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Slug <span className="text-text-muted font-normal">(auto-generated from title)</span></label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                placeholder="auto-generated-from-title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              >
                <option value="ARTICLE">Article</option>
                <option value="NEWS">News</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="COURSE">Course</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary resize-none"
              placeholder="Short description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary font-mono resize-y"
              placeholder="<h2>Introduction</h2>\n<p>Your content here...</p>"
            />
            <p className="text-xs text-text-muted mt-1">Supports HTML. Content will be sanitized server-side.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Cover Image URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              placeholder="cybersecurity, pentesting, tutorial"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">SEO Title</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">SEO Description</label>
              <input
                type="text"
                value={form.metaDesc}
                onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="rounded border-border"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                className="rounded border-border"
              />
              Pinned
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => handleSubmit("DRAFT")}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors"
            >
              <Eye className="h-4 w-4" /> Publish
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
