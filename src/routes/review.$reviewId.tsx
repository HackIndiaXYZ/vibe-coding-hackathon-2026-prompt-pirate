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
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getReviewById, saveReview } from "@/lib/storage";
import { generateReview } from "@/lib/api/generate.functions";
import type { StoredReview, ExpertId, AgentStatus } from "@/lib/types";
import { GenerationProgress } from "@/components/GenerationProgress";

export const Route = createFileRoute("/review/$reviewId")({
  head: ({ params }) => ({
    meta: [
      { title: `${sampleReview.project} · Review ${params.reviewId} · ProductJudge AI` },
      { name: "description", content: sampleReview.tagline },
    ],
  }),
  component: ReviewDetail,
});

function getMockReview(id: string): StoredReview | null {
  const mockList = [
    { id: "REV-08291", project: "OmniStream Alpha", mode: "startup" },
    { id: "REV-08284", project: "Halo Finance", mode: "pitch" },
    { id: "REV-08271", project: "Beacon Studio", mode: "prototype" },
    { id: "REV-08262", project: "Loop Health", mode: "website" },
    { id: "REV-08250", project: "Drift CRM", mode: "growth" },
    { id: "REV-08245", project: "Nimbus Notes", mode: "hackathon" },
    { id: "REV-08231", project: "Stride Run Club", mode: "mobile" },
    { id: "REV-08220", project: "Atlas Pricing", mode: "competitor" },
  ];
  
  const found = mockList.find(m => m.id === id);
  if (!found) return null;
  
  return {
    id: found.id,
    projectName: found.project,
    tagline: sampleReview.tagline,
    modeId: found.mode as any,
    status: "complete",
    createdAt: "2 hours ago",
    submission: {
      projectName: found.project,
      modeId: found.mode as any,
      inputs: {},
    },
    overallScore: sampleReview.overallScore,
    verdictLabel: sampleReview.verdictLabel,
    scores: sampleReview.scores,
    radar: sampleReview.radar,
    expertFeedback: sampleReview.expertFeedback.map(f => ({
      ...f,
      expertId: f.expertId as ExpertId,
      score: f.expertId === "judge" ? sampleReview.overallScore : 80,
      strengths: ["Market fit", "Execution viability", "Clear value prop"],
      weaknesses: ["High initial CAC", "Complex user flow", "Limited early moat"],
      recommendations: ["Focus on niche enterprise", "Add progressive disclosure", "Build virality loops"]
    })),
    risks: sampleReview.risks,
    improvements: sampleReview.improvements,
    finalVerdict: sampleReview.finalVerdict,
  };
}

function ReviewDetail() {
  const { reviewId } = Route.useParams();
  const [review, setReview] = useState<StoredReview | null>(null);
  
  // Progress states
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({
    init: "idle",
    user: "idle",
    investor: "idle",
    designer: "idle",
    engineer: "idle",
    growth: "idle",
    judge: "idle",
    saving: "idle",
  });
  const [currentStep, setCurrentStep] = useState<string>("Initializing board...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch or mock review
  useEffect(() => {
    if (!isClient) return;

    let found = getReviewById(reviewId);
    if (!found) {
      found = getMockReview(reviewId);
    }

    if (found) {
      setReview(found);
      if (found.status === "error") {
        setErrorMsg(found.errorMessage || "An error occurred during review generation.");
      }
    } else {
      setErrorMsg("Review docket not found in local storage.");
    }
  }, [reviewId, isClient]);

  // Generation effect
  useEffect(() => {
    if (!review) return;
    if (review.status !== "pending" && review.status !== "generating") return;

    let active = true;
    const timers: NodeJS.Timeout[] = [];

    // Mark as generating in state and storage
    if (review.status === "pending") {
      const updated = { ...review, status: "generating" as const };
      saveReview(updated);
      setReview(updated);
    }

    // Agent timeline simulation
    setCurrentStep("Convene the board...");
    setStatuses({
      init: "running",
      user: "idle",
      investor: "idle",
      designer: "idle",
      engineer: "idle",
      growth: "idle",
      judge: "idle",
      saving: "idle",
    });

    // Staggered status activation
    timers.push(
      setTimeout(() => {
        if (!active) return;
        setStatuses(prev => ({
          ...prev,
          init: "complete",
          user: "running",
          investor: "running",
          designer: "running",
          engineer: "running",
          growth: "running",
        }));
        setCurrentStep("Specialists evaluating project...");

        const agents: ExpertId[] = ["user", "investor", "designer", "engineer", "growth"];
        agents.forEach((id, index) => {
          timers.push(
            setTimeout(() => {
              if (!active) return;
              setStatuses(prev => {
                const next = { ...prev, [id]: "complete" as AgentStatus };
                const allSpecialistsDone = agents.every(
                  aId => aId === id || next[aId] === "complete"
                );
                if (allSpecialistsDone) {
                  setCurrentStep("Chief Judge synthesizing final verdict...");
                  return { ...next, judge: "running" as AgentStatus };
                }
                return next;
              });
            }, 2000 + index * 1000 + Math.random() * 500)
          );
        });
      }, 1500)
    );

    // Call the backend API server function
    generateReview({
      data: {
        projectName: review.projectName,
        modeId: review.modeId,
        inputs: review.submission.inputs,
      },
    })
      .then(res => {
        if (!active) return;

        if (res.success && res.data) {
          const result = res.data;
          
          // Clear all pending timers to instantly finish
          timers.forEach(clearTimeout);

          setStatuses({
            init: "complete",
            user: "complete",
            investor: "complete",
            designer: "complete",
            growth: "complete",
            engineer: "complete",
            judge: "complete",
            saving: "running",
          });
          setCurrentStep("Filing review report...");

          // Stagger the completed report view transition slightly for visual polish
          timers.push(
            setTimeout(() => {
              if (!active) return;
              const completeReview: StoredReview = {
                ...review,
                status: "complete",
                tagline: result.tagline,
                overallScore: result.overallScore,
                verdictLabel: result.verdictLabel,
                scores: result.scores,
                radar: result.radar,
                expertFeedback: result.expertFeedback,
                risks: result.risks,
                improvements: result.improvements,
                finalVerdict: result.finalVerdict,
              };

              saveReview(completeReview);
              setReview(completeReview);
              setStatuses(prev => ({ ...prev, saving: "complete" }));
            }, 1200)
          );
        } else {
          const errMsg = ("error" in res ? res.error : "Failed to run Gemini review board.");
          handleFail(errMsg);
        }
      })
      .catch(err => {
        if (!active) return;
        handleFail(err instanceof Error ? err.message : "Network error or API key missing.");
      });

    function handleFail(msg: string) {
      timers.forEach(clearTimeout);
      setStatuses(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] === "running" || next[k] === "idle") {
            next[k] = "error";
          }
        });
        return next;
      });
      setCurrentStep("Generation failed");
      
      const errorReview: StoredReview = {
        ...review!,
        status: "error",
        errorMessage: msg,
      };
      saveReview(errorReview);
      setReview(errorReview);
      setErrorMsg(msg);
    }

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, [review?.status]);

  const handleRetry = () => {
    if (!review) return;
    setErrorMsg(null);
    const pendingReview = {
      ...review,
      status: "pending" as const,
      errorMessage: undefined,
    };
    saveReview(pendingReview);
    setReview(pendingReview);
  };

  // SSR Loading state
  if (!isClient || !review) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="size-8 text-primary animate-spin" />
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {errorMsg ? errorMsg : "Loading Docket..."}
          </div>
          {errorMsg && (
            <Link to="/new" className="text-xs text-primary underline mt-2">
              Start a new review
            </Link>
          )}
        </div>
      </AppShell>
    );
  }

  // Error State
  if (review.status === "error") {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto my-12 p-6 rounded-3xl border border-destructive/20 bg-destructive/[0.03] backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-8 text-destructive" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Review Generation Error
              </div>
              <h1 className="font-display text-2xl tracking-tight mt-0.5">Board failed to respond</h1>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/50 p-4 font-mono text-xs text-destructive/90 overflow-x-auto whitespace-pre-wrap">
            {errorMsg || "An unexpected error occurred during review. Please verify your GEMINI_API_KEY is configured correctly."}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-accent px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition animate-pulse"
            >
              <RefreshCw className="size-3.5" /> Re-convene board
            </button>
            <Link
              to="/new"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card/60 px-4 py-2 text-xs font-medium hover:bg-card transition"
            >
              Back to form
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // Generating State
  if (review.status === "pending" || review.status === "generating") {
    return (
      <AppShell>
        <GenerationProgress
          projectName={review.projectName}
          modeId={review.modeId}
          statuses={statuses}
          currentStep={currentStep}
        />
      </AppShell>
    );
  }

  // Complete State
  const mode = reviewModes.find((m) => m.id === review.modeId)!;
  
  // Map fields for rendering
  const r = {
    id: review.id,
    project: review.projectName,
    tagline: review.tagline,
    modeId: review.modeId,
    createdAt: review.createdAt ? (new Date(review.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? "Today" : new Date(review.createdAt).toLocaleDateString()) : "Recently",
    overallScore: review.overallScore ?? 70,
    verdictLabel: review.verdictLabel ?? "Promising",
    scores: review.scores ?? [],
    radar: review.radar ?? [],
    expertFeedback: review.expertFeedback ?? [],
    risks: review.risks ?? [],
    improvements: review.improvements ?? [],
    finalVerdict: review.finalVerdict ?? "",
  };

  return (
    <AppShell>
      {/* Breadcrumb */}
      <Link
        to="/reviews"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 sm:mb-6"
      >
        <ArrowLeft className="size-3.5" /> Back to docket
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="absolute -top-32 right-10 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-10 size-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-10 items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                {r.id}
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span className="text-[11px] px-2 py-0.5 rounded-md border border-primary/30 bg-primary/10 text-primary font-medium">
                {mode.title}
              </span>
              <span className="size-1 rounded-full bg-muted-foreground hidden sm:inline-block" />
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Clock className="size-3" /> {r.createdAt}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.02]">
              {r.project}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-[60ch]">
              {r.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs font-medium hover:bg-card transition">
                <Share2 className="size-3.5" /> Share verdict
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs font-medium hover:bg-card transition">
                <Download className="size-3.5" /> Export PDF
              </button>
              <button 
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-accent px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition"
              >
                <Sparkles className="size-3.5" /> Re-convene board
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mx-auto lg:mx-0">
            <ScoreRing value={r.overallScore} size={160} label="Overall verdict" />
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success">
              {r.verdictLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Score grid */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Category scorecards
            </div>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight mt-1">
              Breakdown by rubric
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {r.scores.map((s, i) => (
            <div key={s.label} style={{ animation: `rise 0.6s ${i * 50}ms both` }}>
              <ScoreCard label={s.label} value={s.value} delta={[3, -1, 5, 2, -2, 7][i]} />
            </div>
          ))}
        </div>
      </section>

      {/* Radar + Quick summary */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Performance vs benchmark
              </div>
              <div className="font-display text-xl sm:text-2xl italic">Multi-axis review</div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground font-mono shrink-0">
              cohort: pre-seed SaaS
            </div>
          </div>
          <RadarChart data={r.radar} />
        </div>

        <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-5 sm:p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Signal density
          </div>
          <div className="font-display text-xl sm:text-2xl italic mb-4">Top board signals</div>
          <div className="space-y-3">
            {r.expertFeedback.map((f, i) => (
              <div key={f.expertId} className="flex items-center gap-3">
                <div className="font-mono text-[10px] text-muted-foreground w-4 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 text-sm min-w-0 truncate">{f.signal}</div>
                <div className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground shrink-0">
                  {f.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Panel */}
      <section className="mb-6 sm:mb-8">
        <ExpertPanel feedback={r.expertFeedback} />
      </section>

      {/* Risks + Improvements */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/[0.04] backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="size-4 text-destructive" />
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-destructive">
              Risk analysis
            </div>
          </div>
          <div className="font-display text-xl sm:text-2xl italic mb-4">Critical risks</div>
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm sm:text-base">{risk.title}</div>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${
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

        <div className="rounded-3xl border border-success/20 bg-success/[0.04] backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="size-4 text-success" />
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-success">
              Improvement roadmap
            </div>
          </div>
          <div className="font-display text-xl sm:text-2xl italic mb-4">Take these actions</div>
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
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base">{imp.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{imp.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Verdict */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-7 sm:p-10 md:p-14">
          <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-primary to-transparent" />
          <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <Gavel className="size-4 text-primary" />
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Final verdict
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.18] italic max-w-[60ch] text-foreground/95">
            "{r.finalVerdict}"
          </p>
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
