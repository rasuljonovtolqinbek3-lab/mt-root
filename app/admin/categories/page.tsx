"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { LoadingPage } from "@/components/ui/loading";
import { EmptyState } from "@/components/content/empty-state";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  type: string;
  order: number;
  _count: { posts: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => { setCategories(data.categories || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage message="Loading categories..." />;

  return (
    <PageWrapper>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> New Category
          </button>
        </div>

        {categories.length === 0 ? (
          <EmptyState title="No categories" description="Create categories to organize your content." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Slug</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Posts</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium text-text-primary">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{cat.slug}</td>
                    <td className="px-4 py-3 text-text-secondary">{cat.type}</td>
                    <td className="px-4 py-3 text-text-secondary">{cat._count.posts}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="rounded p-1.5 text-text-muted hover:text-accent-yellow hover:bg-surface transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-text-muted hover:text-accent-red hover:bg-surface transition-colors">
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
