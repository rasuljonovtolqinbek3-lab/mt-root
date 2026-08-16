import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Settings</h1>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Nickname</label>
                <input type="text" defaultValue={user.nickname} disabled className="w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary opacity-60" />
                <p className="text-xs text-text-muted mt-1">Nickname cannot be changed.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Recovery</h2>
            <p className="text-sm text-text-secondary">Recovery codes will be available in a future update.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
