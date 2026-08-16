import { redirect } from "next/navigation";
import { getCurrentUserSafe } from "@/lib/auth";
import Link from "next/link";
import { Shield, FileText, FolderTree, Users, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserSafe();
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-background-secondary">
        <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-text-primary">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-2 px-4 h-14 border-b border-border lg:hidden">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-text-primary">Admin</span>
        </div>
        {children}
      </main>
    </div>
  );
}
