import { Link } from "@tanstack/react-router";
import { Sparkles, Plus, LayoutDashboard, FolderClosed, Settings, Search } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-aurora opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <TopBar />
          <main className="px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border/60">
        <div className="relative">
          <div className="size-7 rounded-md bg-gradient-to-br from-primary to-accent shadow-glow" />
          <Sparkles className="absolute -right-1 -top-1 size-3 text-accent" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-semibold tracking-tight">ProductJudge</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">AI Review Board</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 text-sm">
        <NavItem to="/" icon={LayoutDashboard} label="Overview" exact />
        <NavItem to="/reviews" icon={FolderClosed} label="Reviews" />
        <NavItem to="/new" icon={Plus} label="New Review" />
        <NavItem to="/settings" icon={Settings} label="Settings" />

        <div className="pt-6">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Recent
          </div>
          {[
            { id: "REV-08291", name: "OmniStream Alpha" },
            { id: "REV-08284", name: "Halo Finance" },
            { id: "REV-08271", name: "Beacon Studio" },
          ].map((r) => (
            <Link
              key={r.id}
              to="/review/$reviewId"
              params={{ reviewId: r.id }}
              className="flex items-center justify-between rounded-md px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <span className="truncate">{r.name}</span>
              <span className="font-mono text-[10px] opacity-60">{r.id.split("-")[1]}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-medium">Free plan</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">3 reviews left this month</div>
          <button className="mt-2 w-full rounded-md bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  exact,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors data-[status=active]:bg-secondary data-[status=active]:text-foreground data-[status=active]:shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.06)]"
    >
      <Icon className="size-4 opacity-80 group-hover:opacity-100" />
      <span className="text-[13px] font-medium">{label}</span>
    </Link>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/70 px-8 backdrop-blur-xl">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          placeholder="Search reviews, projects, experts…"
          className="w-full h-9 rounded-lg border border-border bg-surface/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        <kbd className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
          <span className="size-1.5 rounded-full bg-success animate-pulse-glow" />
          Board online · 6 agents
        </div>
        <Link
          to="/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-accent px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition"
        >
          <Plus className="size-4" />
          New Review
        </Link>
        <div className="size-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border border-border" />
      </div>
    </header>
  );
}
