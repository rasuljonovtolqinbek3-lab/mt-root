"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Newspaper, GraduationCap, Shield, Bug, Wifi, Terminal, Eye, Globe,
  Code2, Binary, Database, Server, Wrench, Trophy, Flag, Calendar, BarChart3,
  MessageCircle, TrendingUp, Info, Briefcase, Mail, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sections: SidebarSection[] = [
  {
    title: "Learn",
    items: [
      { href: "/news", label: "Cyber News", icon: Newspaper },
      { href: "/learning", label: "Tutorials", icon: GraduationCap },
      { href: "/pentesting", label: "Pentesting", icon: Shield },
      { href: "/red-team", label: "Red Team", icon: Bug },
      { href: "/wifi-security", label: "Wi-Fi Security", icon: Wifi },
      { href: "/linux", label: "Linux / Kali", icon: Terminal },
      { href: "/osint", label: "OSINT", icon: Eye },
      { href: "/web-security", label: "Web Security", icon: Globe },
    ],
  },
  {
    title: "Developer",
    items: [
      { href: "/programming", label: "Programming", icon: Code2 },
      { href: "/algorithms", label: "Algorithms", icon: Binary },
      { href: "/data-structures", label: "Data Structures", icon: Database },
      { href: "/web-development", label: "Web Dev", icon: Globe },
      { href: "/backend", label: "Backend", icon: Server },
      { href: "/devops", label: "DevOps", icon: Wrench },
    ],
  },
  {
    title: "Compete",
    items: [
      { href: "/competitions", label: "Competitions", icon: Trophy },
      { href: "/programming", label: "Problems", icon: Code2 },
      { href: "/ctf", label: "CTF", icon: Flag },
      { href: "/daily-challenge", label: "Daily Challenge", icon: Calendar },
      { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "/community", label: "Chat", icon: MessageCircle },
      { href: "/community", label: "Discussions", icon: MessageCircle },
      { href: "/trending", label: "Trending", icon: TrendingUp },
    ],
  },
  {
    title: "MT_ROOT",
    items: [
      { href: "/mt-root", label: "About", icon: Info },
      { href: "/services", label: "Services", icon: Briefcase },
      { href: "/contact", label: "Contact", icon: Mail },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-background-secondary h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-8 border-b border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <nav className="flex-1 py-3 px-2 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h3 className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {section.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
