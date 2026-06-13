import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ScoreCard } from "@/components/ScoreCard";
import { ScoreRing } from "@/components/ScoreRing";
import { ExpertPanel } from "@/components/ExpertPanel";
import { RadarChart } from "@/components/RadarChart";
import { reviewModes, sampleReview, experts, recentReviews } from "@/lib/review-data";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Zap,
  Shield,
  Gauge,
  FileText,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProductJudge AI — The AI Review Board for Builders" },
      {
        name: "description",
        content:
          "Submit your idea, prototype, website, or product. Receive structured expert feedback from an AI review board of investor, designer, engineer, growth, user, and judge agents.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <AppShell>
      <Hero />
      <LiveDashboard />
      <ReviewModesSection />
      <ExpertsSection />
      <ProcessSection />
      <FinalCTA />
      <Footer />
    </AppShell>
  );
}

function Hero() {
  return (
    <section className="relative pb-10 sm:pb-16">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-start lg:items-end">
        <div className="animate-rise min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] backdrop-blur">
            <span className="size-1.5 rounded-full bg-success animate-pulse-glow" />
            <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Docket v4.2 · 12,418 reviews delivered
            </span>
          </div>
          <h1 className="mt-5 sm:mt-6 font-display text-[44px] sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
            Your product, <br className="hidden sm:block" />
            on trial by a board of{" "}
            <span className="italic text-gradient">AI experts.</span>
          </h1>
          <p className="mt-5 sm:mt-6 max-w-[58ch] text-base sm:text-lg text-muted-foreground leading-relaxed">
            Submit your idea, prototype, website, app or pitch. Six specialized AI agents convene
            to score, critique and certify your project — with scorecards, risk analysis, an
            improvement roadmap and a final verdict.
          </p>

          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              to="/new"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 active:scale-[0.98] transition"
            >
              Submit for review
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/review/$reviewId"
              params={{ reviewId: sampleReview.id }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur hover:bg-card transition"
            >
              See a sample verdict
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-3 max-w-md gap-4 sm:gap-6">
            {[
              { k: "Avg. score uplift", v: "+18 pts" },
              { k: "Median verdict", v: "94 sec" },
              { k: "Agents per review", v: "6" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-2xl sm:text-3xl tracking-tight">{s.v}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroVerdictCard />
      </div>
    </section>
  );
}

function HeroVerdictCard() {
  return (
    <div
      className="relative rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5 sm:p-6 shadow-elevated overflow-hidden animate-rise w-full"
      style={{ animationDelay: "120ms" }}
    >
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 size-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground truncate">
            Live verdict · {sampleReview.id}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-success/30 bg-success/10 text-success shrink-0">
            STRONG POTENTIAL
          </span>
        </div>
        <div className="font-display text-xl sm:text-2xl mb-1">{sampleReview.project}</div>
        <div className="text-xs text-muted-foreground mb-6">{sampleReview.tagline}</div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="shrink-0">
            <ScoreRing value={sampleReview.overallScore} size={120} label="Overall" />
          </div>
          <div className="flex-1 min-w-0 space-y-2.5">
            {sampleReview.scores.slice(0, 4).map((s, i) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-[11px] mb-1 gap-2">
                  <span className="text-muted-foreground truncate">{s.label}</span>
                  <span className="font-mono tabular-nums shrink-0">{s.value}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000"
                    style={{ width: `${s.value}%`, transitionDelay: `${i * 100}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between gap-3">
          <div className="flex -space-x-2">
            {experts.map((e) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.id}
                  className="size-8 rounded-full border-2 border-card grid place-items-center"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${e.color}66, oklch(0.18 0.02 265))`,
                  }}
                  title={e.role}
                >
                  <Icon className="size-3.5" style={{ color: e.color }} />
                </div>
              );
            })}
          </div>
          <Link
            to="/review/$reviewId"
            params={{ reviewId: sampleReview.id }}
            className="text-xs font-medium inline-flex items-center gap-1 text-foreground/90 hover:text-foreground shrink-0"
          >
            <span className="hidden sm:inline">Open full report</span>
            <span className="sm:hidden">Open</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LiveDashboard() {
  return (
    <section className="pt-10 pb-16 sm:pb-20">
      <SectionHeader
        eyebrow="The dashboard is the product"
        title="A review board, not a chatbot."
        desc="Every submission becomes a structured report — overall score, category scorecards, expert verdicts, risks, an improvement roadmap and a final verdict."
      />

      <div className="mt-8 sm:mt-10 grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="xl:col-span-2 rounded-3xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 sm:px-6 py-4">
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Recent reviews
              </div>
              <div className="font-display text-xl sm:text-2xl italic">Board activity</div>
            </div>
            <Link
              to="/reviews"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0"
            >
              View all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentReviews.map((r) => (
              <Link
                key={r.id}
                to="/review/$reviewId"
                params={{ reviewId: r.id }}
                className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3 sm:py-4 hover:bg-secondary/40 transition-colors group"
              >
                <div className="hidden sm:block font-mono text-[10px] text-muted-foreground w-20 shrink-0">
                  {r.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{r.project}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{r.mode}</div>
                </div>
                <div className="hidden md:block h-1.5 w-24 lg:w-32 rounded-full bg-secondary overflow-hidden shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${r.score}%` }}
                  />
                </div>
                <div className="font-display text-xl sm:text-2xl tracking-tight w-10 text-right tabular-nums shrink-0">
                  {r.score}
                </div>
                <div
                  className={`w-10 text-right text-xs font-mono tabular-nums shrink-0 ${
                    r.trend.startsWith("+") ? "text-success" : "text-destructive"
                  }`}
                >
                  {r.trend}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-5 sm:p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Performance vs benchmark
          </div>
          <div className="font-display text-xl sm:text-2xl italic mt-1 mb-2">
            Multi-axis review
          </div>
          <RadarChart data={sampleReview.radar} />
        </div>
      </div>

      <div className="mt-4 sm:mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sampleReview.scores.map((s, i) => (
          <div key={s.label} style={{ animation: `rise 0.6s ${i * 60}ms both` }}>
            <ScoreCard label={s.label} value={s.value} delta={i % 2 === 0 ? 4 : -2} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewModesSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <SectionHeader
        eyebrow="Review modes"
        title="Specialized boards for every stage."
        desc="From a napkin sketch to a public launch. Choose a review mode — the panel adjusts its rubric to match."
      />

      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {reviewModes.map((m, i) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              to="/new"
              search={{ mode: m.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-elevated"
              style={{ animation: `rise 0.6s ${i * 40}ms both` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="size-9 rounded-lg border border-border bg-secondary grid place-items-center transition-transform group-hover:scale-105">
                    <Icon className="size-4" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="font-display text-xl leading-tight">{m.title}</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                  {m.short}
                </div>
                <div className="mt-3 text-sm text-muted-foreground/90 leading-snug">
                  {m.description}
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {m.outputs.slice(0, 3).map((o) => (
                    <span
                      key={o}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-background/40 text-muted-foreground"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ExpertsSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <SectionHeader
        eyebrow="The AI Expert Panel"
        title="Six points of view. One verdict."
        desc="Every review is judged by a panel of agents — each with a sharp lens, distinct biases and structured rubric."
      />

      <div className="mt-8 sm:mt-10">
        <ExpertPanel feedback={sampleReview.expertFeedback} />
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { i: "01", icon: FileText, t: "Submit", d: "Drop an idea, a Figma link, a URL, screenshots or a deck." },
    {
      i: "02",
      icon: Workflow,
      t: "Convene",
      d: "The board reviews in parallel — User, Investor, Designer, Engineer, Growth, Judge.",
    },
    { i: "03", icon: Gauge, t: "Score", d: "Structured scorecards across category-specific rubrics." },
    { i: "04", icon: Shield, t: "Verdict", d: "Risks, an improvement roadmap and a one-paragraph final verdict." },
  ];
  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <SectionHeader
        eyebrow="How it works"
        title="From submission to verdict in under two minutes."
      />
      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.i}
              className="relative rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-border/80"
              style={{ animation: `rise 0.6s ${i * 80}ms both` }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Step {s.i}
              </div>
              <div className="mt-6 size-10 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center shadow-glow">
                <Icon className="size-4 text-primary-foreground" />
              </div>
              <div className="mt-4 font-display text-2xl">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 border-t border-border">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-8 sm:p-10 md:p-16">
        <div className="absolute -top-32 right-0 size-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-10 size-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl">
          <Sparkles className="size-6 text-accent mb-4" />
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Ship with conviction. Or don't ship at all.
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-[55ch]">
            The board meets every minute of every day. Submit your product and receive a verdict
            you can act on.
          </p>
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              to="/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition"
            >
              <Zap className="size-4" /> Start a review
            </Link>
            <Link
              to="/review/$reviewId"
              params={{ reviewId: sampleReview.id }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-medium hover:bg-card"
            >
              Read a sample verdict <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6 flex-wrap">
      <div className="max-w-2xl">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </div>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05]">
          {title}
        </h2>
        {desc && (
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-[58ch]">{desc}</p>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 pt-8 sm:pt-10 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
        © 2026 ProductJudge AI · Built for builders
      </div>
      <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-muted-foreground">
        <a href="#" className="hover:text-foreground">Methodology</a>
        <a href="#" className="hover:text-foreground">Pricing</a>
        <a href="#" className="hover:text-foreground">API</a>
        <a href="#" className="hover:text-foreground">Changelog</a>
      </div>
    </footer>
  );
}
