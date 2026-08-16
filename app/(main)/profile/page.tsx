import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatNumber } from "@/lib/utils";
import { Flame, Trophy, Star, Bookmark, MessageSquare, Code, Flag } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");

  const xpToNext = user.level ? user.level.maxXp - user.xp : 100;
  const xpProgress = user.level ? Math.min(100, Math.round(((user.xp - user.level.minXp) / (user.level.maxXp - user.level.minXp)) * 100)) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="relative h-48 rounded-2xl bg-gradient-to-r from-primary/20 via-accent-purple/20 to-accent-green/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>
      <div className="relative -mt-16 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <img src={user.avatar || ""} alt={user.nickname} className="h-32 w-32 rounded-2xl border-4 border-background shadow-glow-cyan" />
          <div className="mb-2 flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{user.nickname}</h1>
            <p className="text-text-secondary">{user.level ? `Level ${user.level.number} — ${user.level.name}` : "Level 1 — Newbie"}</p>
          </div>
          <div className="mb-2 flex items-center gap-2 rounded-full bg-accent-orange/10 px-4 py-2 text-accent-orange border border-accent-orange/20">
            <Flame className="h-4 w-4" /><span className="text-sm font-medium">{user.streak} day streak</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Star} label="XP" value={formatNumber(user.xp)} />
        <StatCard icon={MessageSquare} label="Comments" value={String(user._count.comments)} />
        <StatCard icon={Code} label="Submissions" value={String(user._count.submissions)} />
        <StatCard icon={Flag} label="CTF Solved" value={String(user._count.ctfSubmissions)} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-secondary">XP Progress</span>
          <span className="text-text-muted">{user.xp} / {user.level?.maxXp || "∞"}</span>
        </div>
        <div className="h-2 rounded-full bg-background-secondary"><div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent-purple transition-all" style={{ width: `${xpProgress}%` }} /></div>
        <p className="mt-2 text-xs text-text-muted">{xpToNext} XP to next level</p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary"><Trophy className="h-5 w-5 text-accent-yellow" /> Achievements</h2>
          {user._count.achievements === 0 ? <p className="text-sm text-text-muted">No achievements yet. Start exploring MT_ROOT!</p> : <p className="text-sm text-text-muted">{user._count.achievements} achievements unlocked</p>}
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary"><Bookmark className="h-5 w-5 text-primary" /> Bookmarks</h2>
          {user._count.bookmarks === 0 ? <p className="text-sm text-text-muted">No bookmarks yet. Save useful knowledge!</p> : <p className="text-sm text-text-muted">{user._count.bookmarks} saved items</p>}
        </div>
      </div>

      <p className="mt-8 text-xs text-text-muted">Joined {formatDate(user.createdAt)}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
      <p className="text-xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
