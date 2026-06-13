import {
  User,
  Briefcase,
  Brush,
  Cog,
  LineChart,
  Gavel,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { ExpertId, AgentStatus, ReviewModeId } from "@/lib/types";
import { reviewModes } from "@/lib/review-data";

type AgentUI = {
  id: ExpertId;
  name: string;
  role: string;
  color: string;
  icon: typeof User;
  focus: string[];
  phrases: {
    running: string;
    complete: string;
  };
};

const AGENTS: AgentUI[] = [
  {
    id: "user",
    name: "Iris Vale",
    role: "User Agent",
    color: "oklch(0.78 0.14 195)", // Cyan/Teal
    icon: User,
    focus: ["First Impressions", "Onboarding Ease", "Cognitive Load"],
    phrases: {
      running: "Mapping user onboarding friction...",
      complete: "User experience scorecard finalized.",
    },
  },
  {
    id: "investor",
    name: "Marcus Thorne",
    role: "Investor Agent",
    color: "oklch(0.74 0.16 158)", // Green/Emerald
    icon: Briefcase,
    focus: ["Market Size (TAM)", "Monetization Path", "Defensibility"],
    phrases: {
      running: "Analyzing unit economics and TAM...",
      complete: "Market viability report complete.",
    },
  },
  {
    id: "designer",
    name: "Lena Park",
    role: "Designer Agent",
    color: "oklch(0.78 0.18 340)", // Pink/Rose
    icon: Brush,
    focus: ["Visual Clarity", "Info Hierarchy", "UX Polish"],
    phrases: {
      running: "Auditing layout consistency & UX patterns...",
      complete: "Interface critique submitted.",
    },
  },
  {
    id: "engineer",
    name: "Kai Okafor",
    role: "Engineer Agent",
    color: "oklch(0.7 0.19 268)", // Indigo/Blue
    icon: Cog,
    focus: ["Technical Feasibility", "Scale Complexity", "Build Speed"],
    phrases: {
      running: "Evaluating tech stack risks & feasibility...",
      complete: "Architecture assessment uploaded.",
    },
  },
  {
    id: "growth",
    name: "Sana Iyer",
    role: "Growth Agent",
    color: "oklch(0.78 0.16 75)", // Yellow/Amber
    icon: LineChart,
    focus: ["Acquisition Channels", "Viral Loops", "Retention Hooks"],
    phrases: {
      running: "Calculating viral coefficient potentials...",
      complete: "Distribution playbook formulated.",
    },
  },
  {
    id: "judge",
    name: "Hon. Aurelia Vance",
    role: "Chief Judge",
    color: "oklch(0.66 0.22 22)", // Orange/Red
    icon: Gavel,
    focus: ["Synthesis of Reports", "Overall Scorecard", "Critical Risks"],
    phrases: {
      running: "Weighing specialist verdicts & synthesizing...",
      complete: "Final review docket certified.",
    },
  },
];

type GenerationProgressProps = {
  projectName: string;
  modeId: ReviewModeId;
  statuses: Record<string, AgentStatus>;
  currentStep: string;
};

export function GenerationProgress({
  projectName,
  modeId,
  statuses,
  currentStep,
}: GenerationProgressProps) {
  const mode = reviewModes.find((m) => m.id === modeId)!;

  return (
    <div className="space-y-8 animate-rise">
      {/* Main Header / Status Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 sm:p-8">
        <div className="absolute -top-32 right-10 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 left-10 size-96 rounded-full bg-accent/15 blur-3xl pointer-events-none animate-pulse" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left min-w-0 flex-1">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2 text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground">
              <span>BOARD CONVENED</span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span className="text-primary font-bold">{mode.title}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Reviewing <span className="italic text-gradient">{projectName}</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-[50ch] mx-auto md:mx-0">
              The expert panel is analyzing your submission details and grading them against
              mode-specific benchmarks.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0 bg-background/50 border border-border/80 px-6 py-5 rounded-2xl min-w-[200px]">
            {statuses.judge === "complete" ? (
              <CheckCircle2 className="size-8 text-success animate-bounce" />
            ) : (
              <Loader2 className="size-8 text-primary animate-spin" />
            )}
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1 text-center">
              Current Phase
            </div>
            <div className="text-sm font-semibold text-center text-foreground truncate max-w-[180px]">
              {currentStep}
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="space-y-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground px-1">
          Agent-by-agent status
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((agent) => {
            const status = statuses[agent.id] ?? "idle";
            const Icon = agent.icon;
            const isActive = status === "running";
            const isDone = status === "complete";
            const isError = status === "error";

            return (
              <div
                key={agent.id}
                className={`group relative rounded-2xl border transition-all duration-500 overflow-hidden ${
                  isActive
                    ? "bg-secondary/40 shadow-elevated border-border"
                    : isDone
                      ? "bg-card/25 border-success/20 opacity-85"
                      : isError
                        ? "bg-destructive/[0.03] border-destructive/30"
                        : "bg-card/10 border-border/40 opacity-50"
                }`}
                style={{
                  boxShadow: isActive ? `0 0 20px ${agent.color}15` : undefined,
                  borderColor: isActive ? agent.color : undefined,
                }}
              >
                {/* Active scanner animation line */}
                {isActive && (
                  <div
                    className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent animate-shimmer"
                    style={{ color: agent.color }}
                  />
                )}

                <div className="p-5 flex gap-4">
                  {/* Avatar Icon */}
                  <div
                    className={`size-12 rounded-xl border grid place-items-center shrink-0 transition-transform duration-300 ${
                      isActive ? "scale-105" : ""
                    }`}
                    style={{
                      borderColor: isActive || isDone ? agent.color : "oklch(1 0 0 / 0.08)",
                      background: `radial-gradient(circle at 30% 30%, ${agent.color}${
                        isActive ? "33" : isDone ? "1a" : "00"
                      }, transparent 70%)`,
                      boxShadow: isActive ? `0 0 16px ${agent.color}44` : "none",
                    }}
                  >
                    <Icon
                      className={`size-5 transition-colors`}
                      style={{ color: isActive || isDone ? agent.color : "oklch(1 0 0 / 0.4)" }}
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-sm leading-tight text-foreground truncate">
                        {agent.role}
                      </div>
                      <div className="shrink-0">
                        {isActive && (
                          <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-primary uppercase">
                            <span className="relative flex size-1.5">
                              <span
                                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                                style={{ backgroundColor: agent.color }}
                              />
                              <span
                                className="relative inline-flex rounded-full h-1.5 w-1.5"
                                style={{ backgroundColor: agent.color }}
                              />
                            </span>
                            Running
                          </span>
                        )}
                        {isDone && (
                          <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-success uppercase">
                            <CheckCircle2 className="size-3 text-success" />
                            Done
                          </span>
                        )}
                        {isError && (
                          <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-destructive uppercase">
                            <AlertCircle className="size-3 text-destructive" />
                            Failed
                          </span>
                        )}
                        {status === "idle" && (
                          <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                            <Clock className="size-3 text-muted-foreground/60" />
                            Queued
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                      {agent.name}
                    </div>

                    <p className="text-xs text-muted-foreground/90 pt-1.5 min-h-[32px] line-clamp-2 leading-relaxed">
                      {isActive
                        ? agent.phrases.running
                        : isDone
                          ? agent.phrases.complete
                          : isError
                            ? "Board communication dropped."
                            : `Focus: ${agent.focus.join(", ")}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Convene Tip Banner */}
      <div className="rounded-xl border border-dashed border-border bg-background/30 p-4 flex items-center gap-3">
        <Sparkles className="size-4 text-accent shrink-0 animate-pulse" />
        <div className="text-xs text-muted-foreground">
          Tip: Six AI specialists analyze the exact same form details from distinct points of view in
          parallel. The Judge Agent then resolves contradictions to present a single balanced report.
        </div>
      </div>
    </div>
  );
}
