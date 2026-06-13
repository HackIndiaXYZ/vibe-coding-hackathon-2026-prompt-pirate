import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { recentReviews, reviewModes } from "@/lib/review-data";
import { ArrowUpRight, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllReviews } from "@/lib/storage";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [{ title: "Reviews · ProductJudge AI" }],
  }),
  component: Reviews,
});

function Reviews() {
  const [all, setAll] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = getAllReviews();
    const mappedStored = stored.map(r => {
      const mode = reviewModes.find(m => m.id === r.modeId);
      return {
        id: r.id,
        project: r.projectName,
        mode: mode ? mode.title : "Review",
        score: r.overallScore ?? 0,
        trend: r.status === "complete" ? "+0" : r.status === "generating" || r.status === "pending" ? "Gen..." : "Err",
        status: r.status,
      };
    });

    const samples = [
      ...recentReviews.map(r => ({ ...r, status: "complete" })),
      { id: "REV-08245", project: "Nimbus Notes", mode: "Hackathon Project", score: 88, trend: "+8", status: "complete" },
      { id: "REV-08231", project: "Stride Run Club", mode: "Mobile App", score: 67, trend: "+1", status: "complete" },
      { id: "REV-08220", project: "Atlas Pricing", mode: "Competitor Positioning", score: 74, trend: "+5", status: "complete" },
    ];

    const filteredSamples = samples.filter(s => !mappedStored.some(m => m.id === s.id));
    setAll([...mappedStored, ...filteredSamples]);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Docket
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tight">All reviews</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Every verdict the board has delivered, ranked by recency.
          </p>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-accent px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-glow w-fit"
        >
          <Plus className="size-4" /> New Review
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_180px_minmax(120px,1fr)_80px_60px] gap-4 px-6 py-3 border-b border-border text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
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
            className="group grid grid-cols-[100px_1fr_180px_minmax(120px,1fr)_80px_60px] gap-4 px-6 py-4 border-b last:border-b-0 border-border items-center hover:bg-secondary/40 transition-colors"
          >
            <div className="font-mono text-[11px] text-muted-foreground">{r.id}</div>
            <div className="font-medium flex items-center gap-2 min-w-0">
              <span className="truncate">{r.project}</span>
              <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <div className="text-xs text-muted-foreground truncate">{r.mode}</div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${r.score}%` }}
              />
            </div>
            <div className="font-display text-2xl text-right tabular-nums">
              {r.status === "complete" ? r.score : "—"}
            </div>
            <div
              className={`text-right text-xs font-mono tabular-nums ${
                r.trend.startsWith("+")
                  ? "text-success"
                  : r.trend === "Gen..."
                    ? "text-primary animate-pulse font-semibold"
                    : "text-destructive"
              }`}
            >
              {r.trend}
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {all.map((r) => (
          <Link
            key={r.id}
            to="/review/$reviewId"
            params={{ reviewId: r.id }}
            className="block rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-4 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] text-muted-foreground">{r.id}</div>
                <div className="font-medium mt-0.5 truncate flex items-center gap-1.5">
                  <span className="truncate">{r.project}</span>
                  {(r.status === "generating" || r.status === "pending") && (
                    <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{r.mode}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-3xl tracking-tight tabular-nums">
                  {r.status === "complete" ? r.score : "—"}
                </div>
                <div
                  className={`text-[11px] font-mono tabular-nums ${
                    r.trend.startsWith("+")
                      ? "text-success"
                      : r.trend === "Gen..."
                        ? "text-primary animate-pulse font-semibold"
                        : "text-destructive"
                  }`}
                >
                  {r.trend}
                </div>
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full ${r.status === "generating" || r.status === "pending" ? "bg-primary/40 animate-pulse" : "bg-gradient-to-r from-primary to-accent"}`}
                style={{ width: `${r.status === "complete" ? r.score : 30}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
