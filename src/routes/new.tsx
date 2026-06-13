import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { reviewModes, type ReviewModeId } from "@/lib/review-data";
import { useState } from "react";
import { ArrowRight, Sparkles, Upload, Link2, FileText } from "lucide-react";
import { z } from "zod";
import { saveReview, generateReviewId } from "@/lib/storage";

const search = z.object({
  mode: z
    .enum([
      "startup",
      "hackathon",
      "prototype",
      "website",
      "mobile",
      "pitch",
      "growth",
      "launch",
      "competitor",
      "workflow",
    ])
    .optional(),
});

export const Route = createFileRoute("/new")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "New Review · ProductJudge AI" },
      { name: "description", content: "Submit a project for structured review by the AI board." },
    ],
  }),
  component: NewReview,
});

function NewReview() {
  const { mode } = Route.useSearch();
  const [selected, setSelected] = useState<ReviewModeId>(mode ?? "startup");
  const navigate = useNavigate();
  const current = reviewModes.find((m) => m.id === selected)!;

  return (
    <AppShell>
      <div className="mb-6 sm:mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          Submit for review
        </div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tight">
          Convene the board.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-[58ch]">
          Pick a review mode and the panel adjusts its rubric. Six agents will deliver a structured
          verdict in under two minutes.
        </p>
      </div>

      {/* Mobile: horizontal scroll pill selector */}
      <div className="lg:hidden -mx-4 px-4 mb-5">
        <div
          className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {reviewModes.map((m) => {
            const Icon = m.icon;
            const active = m.id === selected;
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`shrink-0 snap-start flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                  active
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border bg-card/60 text-muted-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {m.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside className="hidden lg:block rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-3 h-fit lg:sticky lg:top-24">
          <div className="px-2 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Review modes
          </div>
          <div className="space-y-0.5">
            {reviewModes.map((m) => {
              const Icon = m.icon;
              const active = m.id === selected;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <div
                    className={`size-7 rounded-md grid place-items-center border shrink-0 ${
                      active ? "border-primary/40 bg-primary/10" : "border-border bg-background/40"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.title}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{m.short}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5 sm:space-y-6 min-w-0">
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 sm:p-8 relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${current.accent} opacity-40 pointer-events-none`}
            />
            <div className="relative">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                {current.short}
              </div>
              <div className="mt-1 flex items-center gap-3 flex-wrap">
                <current.icon className="size-6 sm:size-7 shrink-0" />
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
                  {current.title}
                </h2>
              </div>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-[58ch]">
                {current.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {current.outputs.map((o) => (
                  <span
                    key={o}
                    className="text-[11px] px-2 py-1 rounded-md border border-border bg-background/40"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const projectName = (formData.get("projectName") as string)?.trim();
              if (!projectName) return;

              const inputs: Record<string, string> = {};
              current.inputs.forEach((label) => {
                inputs[label] = ((formData.get(label) as string) || "").trim();
              });

              const reviewId = generateReviewId();
              const newReview = {
                id: reviewId,
                projectName,
                tagline: "Convening the AI Review Board...",
                modeId: selected,
                status: "pending" as const,
                createdAt: new Date().toISOString(),
                submission: {
                  projectName,
                  modeId: selected,
                  inputs,
                },
              };

              saveReview(newReview);
              navigate({ to: "/review/$reviewId", params: { reviewId } });
            }}
            className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-5 sm:p-8 space-y-6"
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mb-3">
                Inputs
              </div>
              <div className="space-y-4">
                {/* Project Name Field */}
                <div className="block">
                  <label htmlFor="input-project-name" className="flex items-center gap-2 mb-1.5">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <span className="text-[12px] font-medium">Project Name</span>
                  </label>
                  <input
                    id="input-project-name"
                    name="projectName"
                    type="text"
                    required
                    placeholder="Enter the name of your project or idea..."
                    className="w-full h-11 rounded-lg border border-border bg-background/60 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>

                {current.inputs.map((label) => {
                  const Icon = label.toLowerCase().includes("link") || label.toLowerCase().includes("url")
                    ? Link2
                    : label.toLowerCase().includes("screenshot") || label.toLowerCase().includes("deck") || label.toLowerCase().includes("wireframe")
                      ? Upload
                      : FileText;
                  const isLong = label.toLowerCase().includes("description") || label.toLowerCase().includes("summary") || label.toLowerCase().includes("journey") || label.toLowerCase().includes("workflow") || label.toLowerCase().includes("features");
                  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
                  return (
                    <div key={label} className="block">
                      <label htmlFor={inputId} className="flex items-center gap-2 mb-1.5">
                        <Icon className="size-3.5 text-muted-foreground" />
                        <span className="text-[12px] font-medium">{label}</span>
                      </label>
                      {isLong ? (
                        <textarea
                          id={inputId}
                          name={label}
                          rows={4}
                          placeholder={`Describe your ${label.toLowerCase()}…`}
                          className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
                        />
                      ) : (
                        <input
                          id={inputId}
                          name={label}
                          type="text"
                          placeholder={`Enter ${label.toLowerCase()}`}
                          className="w-full h-11 rounded-lg border border-border bg-background/60 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-background/30 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Upload className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 text-xs text-muted-foreground">
                Drop attachments here — Figma exports, screenshots, PDFs, decks. Max 25 MB.
              </div>
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-secondary self-start sm:self-auto"
              >
                Browse
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-accent shrink-0" />
                <span className="truncate">Powered by Gemini Pro · 6 agents convene in parallel</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition"
              >
                Convene the board
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to overview
        </Link>
      </div>
    </AppShell>
  );
}
