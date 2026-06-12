import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { recentReviews } from "@/lib/review-data";
import { ArrowUpRight, Plus } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [{ title: "Reviews · ProductJudge AI" }],
  }),
  component: Reviews,
});

function Reviews() {
  const all = [
    ...recentReviews,
    { id: "REV-08245", project: "Nimbus Notes", mode: "Hackathon Project", score: 88, trend: "+8" },
    { id: "REV-08231", project: "Stride Run Club", mode: "Mobile App", score: 67, trend: "+1" },
    { id: "REV-08220", project: "Atlas Pricing", mode: "Competitor Positioning", score: 74, trend: "+5" },
  ];
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Docket
          </div>
          <h1 className="mt-2 font-display text-5xl tracking-tight">All reviews</h1>
          <p className="mt-2 text-muted-foreground">
            Every verdict the board has delivered, ranked by recency.
          </p>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-accent px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="size-4" /> New Review
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_180px_140px_80px_60px] gap-4 px-6 py-3 border-b border-border text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          <div>ID</div>
          <div>Project</div>
          <div>Mode</div>
          <div>Score</div>
          <div className="text-right">Value</div>
          <div className="text-right">Trend</div>
        </div>
        {all.map((r) => (
          <Link
            key={r.id}
            to="/review/$reviewId"
            params={{ reviewId: r.id }}
            className="group grid grid-cols-[100px_1fr_180px_140px_80px_60px] gap-4 px-6 py-4 border-b last:border-b-0 border-border items-center hover:bg-secondary/40 transition-colors"
          >
            <div className="font-mono text-[11px] text-muted-foreground">{r.id}</div>
            <div className="font-medium flex items-center gap-2">
              {r.project}
              <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs text-muted-foreground">{r.mode}</div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${r.score}%` }}
              />
            </div>
            <div className="font-display text-2xl text-right">{r.score}</div>
            <div
              className={`text-right text-xs font-mono ${
                r.trend.startsWith("+") ? "text-success" : "text-destructive"
              }`}
            >
              {r.trend}
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
