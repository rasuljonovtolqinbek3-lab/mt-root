import { PageWrapper } from "@/components/layout/page-wrapper";
import { BarChart3, Users, FileText, Eye } from "lucide-react";

export default function AdminDashboard() {
  return (
    <PageWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Posts", value: "—", icon: FileText, color: "text-primary" },
            { label: "Total Users", value: "—", icon: Users, color: "text-accent-green" },
            { label: "Total Views", value: "—", icon: Eye, color: "text-accent-yellow" },
            { label: "Engagement", value: "—", icon: BarChart3, color: "text-accent-purple" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-border bg-surface p-5">
                <Icon className={`h-5 w-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-sm text-text-muted">Full analytics dashboard coming in Phase 11.</p>
      </div>
    </PageWrapper>
  );
}
