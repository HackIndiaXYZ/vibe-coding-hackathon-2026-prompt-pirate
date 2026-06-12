import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreCard } from "@/components/ScoreCard";
import { ExpertPanel } from "@/components/ExpertPanel";
import { RadarChart } from "@/components/RadarChart";
import { sampleReview, reviewModes } from "@/lib/review-data";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Download,
  Sparkles,
  Clock,
  Gavel,
} from "lucide-react";

export const Route = createFileRoute("/review/$reviewId")({
  head: ({ params }) => ({
    meta: [
      { title: `${sampleReview.project} · Review ${params.reviewId} · ProductJudge AI` },
      { name: "description", content: sampleReview.tagline },
    ],
  }),
  component: ReviewDetail,
});

function ReviewDetail() {
  const r = sampleReview;
  const mode = reviewModes.find((m) => m.id === r.modeId)!;

  return (
    <AppShell>
      {/* Breadcrumb */}
      <Link
        to="/reviews"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-3.5" /> Back to docket
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-8 mb-8">
        <div className="absolute -top-32 right-10 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-10 size-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                {r.id}
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span className="text-[11px] px-2 py-0.5 rounded-md border border-primary/30 bg-primary/10 text-primary font-medium">
                {mode.title}
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Clock className="size-3" /> {r.createdAt}
              </span>
            </div>
            <h1 className="font-display text-6xl tracking-tight">{r.project}</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-[60ch]">{r.tagline}</p>

            <div className="mt-6 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs font-medium hover:bg-card">
                <Share2 className="size-3.5" /> Share verdict
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs font-medium hover:bg-card">
                <Download className="size-3.5" /> Export PDF
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-accent px-3 py-2 text-xs font-semibold text-primary-foreground">
                <Sparkles className="size-3.5" /> Re-convene board
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ScoreRing value={r.overallScore} size={180} label="Overall verdict" />
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success">
              {r.verdictLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Score grid */}
      <section className="mb-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Category scorecards
            </div>
            <h2 className="font-display text-3xl tracking-tight mt-1">Breakdown by rubric</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {r.scores.map((s, i) => (
            <div key={s.label} style={{ animation: `rise 0.6s ${i * 50}ms both` }}>
              <ScoreCard label={s.label} value={s.value} delta={[3, -1, 5, 2, -2, 7][i]} />
            </div>
          ))}
        </div>
      </section>

      {/* Radar + Quick summary */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mb-8">
        <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Performance vs benchmark
              </div>
              <div className="font-display text-2xl italic">Multi-axis review</div>
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">cohort: pre-seed SaaS</div>
          </div>
          <RadarChart data={r.radar} />
        </div>

        <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Signal density
          </div>
          <div className="font-display text-2xl italic mb-4">Top board signals</div>
          <div className="space-y-3">
            {r.expertFeedback.map((f, i) => (
              <div key={f.expertId} className="flex items-center gap-3">
                <div className="font-mono text-[10px] text-muted-foreground w-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 text-sm">{f.signal}</div>
                <div className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                  {f.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Panel */}
      <section className="mb-8">
        <ExpertPanel feedback={r.expertFeedback} />
      </section>

      {/* Risks + Improvements */}
      <section className="grid lg:grid-cols-2 gap-5 mb-8">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="size-4 text-destructive" />
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-destructive">
              Risk analysis
            </div>
          </div>
          <div className="font-display text-2xl italic mb-4">Critical risks</div>
          <div className="space-y-3">
            {r.risks.map((risk, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card/60 p-4 flex gap-3"
              >
                <div
                  className={`shrink-0 size-1.5 rounded-full mt-2 ${
                    risk.severity === "critical"
                      ? "bg-destructive"
                      : risk.severity === "high"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{risk.title}</div>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        risk.severity === "critical"
                          ? "bg-destructive/15 text-destructive"
                          : risk.severity === "high"
                            ? "bg-warning/15 text-warning"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{risk.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-success/20 bg-success/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="size-4 text-success" />
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-success">
              Improvement roadmap
            </div>
          </div>
          <div className="font-display text-2xl italic mb-4">Take these actions</div>
          <div className="space-y-3">
            {r.improvements.map((imp, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/60 p-4 flex gap-3">
                <span
                  className={`shrink-0 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded h-fit ${
                    imp.priority === "now"
                      ? "bg-primary/15 text-primary"
                      : imp.priority === "next"
                        ? "bg-accent/15 text-accent"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {imp.priority}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{imp.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{imp.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Verdict */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-10 md:p-14">
          <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-primary to-transparent" />
          <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <Gavel className="size-4 text-primary" />
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Final verdict
            </div>
          </div>
          <p className="font-display text-3xl md:text-4xl leading-[1.15] italic max-w-[60ch] text-foreground/95">
            "{r.finalVerdict}"
          </p>
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              — The Honorable Aurelia Vance, Chief Judge · Board #{r.id.replace("REV-", "")}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-success">
              {r.verdictLabel}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
