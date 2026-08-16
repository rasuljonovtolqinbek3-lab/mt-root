import { PageWrapper } from "@/components/layout/page-wrapper";
import { getPublishedPosts, getTrendingPosts } from "@/lib/content";
import { PostCard } from "@/components/content/post-card";
import { EmptyState } from "@/components/content/empty-state";
import Link from "next/link";
import {
  Terminal, ArrowRight, Flame, Trophy, Star, TrendingUp,
  BookOpen, Code2, MessageCircle, Zap, Target, Users
} from "lucide-react";

export default async function HomePage() {
  const [{ posts: latestPosts }, { posts: featuredPosts }, trendingPosts] = await Promise.all([
    getPublishedPosts({ limit: 6, sortBy: "newest" }),
    getPublishedPosts({ featured: true, limit: 3 }),
    getTrendingPosts(3),
  ]);

  // Separate news from other content
  const newsPosts = latestPosts.filter(p => p.type === "NEWS").slice(0, 3);
  const learningPosts = latestPosts.filter(p => ["TUTORIAL", "COURSE", "ARTICLE"].includes(p.type)).slice(0, 3);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Terminal className="h-4 w-4" />
              <span>MT_ROOT Platform v1.0</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-gradient">MT_ROOT</span>
              <span className="block text-text-primary mt-2">Learn. Build. Secure. Compete.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              A community for developers, cybersecurity enthusiasts and technology learners.
              Explore knowledge, compete in challenges, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/learning" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-background hover:bg-primary/90 transition-colors">
                <BookOpen className="h-4 w-4" /> Explore Learning
              </Link>
              <Link href="/competitions" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary hover:border-primary/30 hover:bg-surface-hover transition-colors">
                <Trophy className="h-4 w-4" /> Join Competition
              </Link>
              <Link href="/community" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary hover:border-primary/30 hover:bg-surface-hover transition-colors">
                <MessageCircle className="h-4 w-4" /> Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-green" /> Trending
            </h2>
            <Link href="/trending" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {trendingPosts.length === 0 ? (
            <EmptyState title="No trending content yet" description="Content will appear here as the community grows." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trendingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Two Column: Latest News + Featured Learning */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Latest News */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent-yellow" /> Latest Cyber News
              </h2>
              <Link href="/news" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {newsPosts.length === 0 ? (
              <EmptyState title="No news yet" description="Latest cybersecurity updates will appear here." />
            ) : (
              <div className="space-y-3">
                {newsPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="compact" />
                ))}
              </div>
            )}
          </section>

          {/* Featured Learning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-purple" /> Featured
              </h2>
            </div>
            {featuredPosts.length === 0 ? (
              <EmptyState title="No featured content" description="Admin-featured content will appear here." />
            ) : (
              <div className="space-y-3">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="compact" />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Daily Challenge + Programming Challenge */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-accent-orange" /> Daily Cyber Challenge
            </h2>
            <p className="text-sm text-text-secondary mb-3">
              Today&apos;s challenge: Identify the vulnerability in this web application.
            </p>
            <div className="rounded-lg bg-background-secondary p-3 font-mono text-xs text-text-secondary border border-border">
              <span className="text-primary">$</span> curl -X POST http://target.com/api/login               <br />&nbsp;&nbsp;-d &quot;user=admin&apos; OR &apos;1&apos;=&apos;1&quot;
            </div>
            <Link href="/daily-challenge" className="inline-flex items-center gap-1.5 mt-3 rounded-md bg-accent-orange/10 px-3 py-1.5 text-xs font-medium text-accent-orange hover:bg-accent-orange/20 transition-colors">
              <Zap className="h-3.5 w-3.5" /> Start Challenge (+50 XP)
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2 mb-3">
              <Code2 className="h-5 w-5 text-accent-green" /> Programming Challenge
            </h2>
            <p className="text-sm text-text-secondary mb-3">
              Find the maximum number in an array with O(n) time complexity.
            </p>
            <div className="rounded-lg bg-background-secondary p-3 font-mono text-xs text-text-secondary border border-border">
              <span className="text-accent-green">def</span> <span className="text-primary">find_max</span>(arr):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-text-muted"># Your code here</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent-purple">pass</span>
            </div>
            <Link href="/programming" className="inline-flex items-center gap-1.5 mt-3 rounded-md bg-accent-green/10 px-3 py-1.5 text-xs font-medium text-accent-green hover:bg-accent-green/20 transition-colors">
              <Code2 className="h-3.5 w-3.5" /> Solve (+75 XP)
            </Link>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent-yellow" /> Leaderboard
            </h2>
            <Link href="/leaderboard" className="text-sm text-primary hover:underline flex items-center gap-1">
              Full ranking <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="space-y-2">
              {[
                { rank: 1, nickname: "CyberWolf", xp: 12450 },
                { rank: 2, nickname: "RootX", xp: 10920 },
                { rank: 3, nickname: "Shadow", xp: 9870 },
                { rank: 4, nickname: "NullPtr", xp: 8540 },
                { rank: 5, nickname: "HexHunter", xp: 7210 },
              ].map((user) => (
                <div key={user.rank} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-hover transition-colors">
                  <span className={user.rank <= 3 ? "text-lg" : "text-sm w-6 text-center text-text-muted"}>
                    {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : user.rank}
                  </span>
                  <span className="flex-1 text-sm font-medium text-text-primary">{user.nickname}</span>
                  <span className="text-sm text-text-muted">{user.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Community Activity
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Comments today", value: "1,247", icon: MessageCircle, color: "text-primary" },
              { label: "Active streaks", value: "89", icon: Flame, color: "text-accent-orange" },
              { label: "Submissions today", value: "342", icon: Code2, color: "text-accent-green" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-border bg-surface p-4 text-center">
                  <Icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
