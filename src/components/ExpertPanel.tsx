import { useState } from "react";
import { experts, type Review } from "@/lib/review-data";
import { Quote } from "lucide-react";

export function ExpertPanel({ feedback }: { feedback: Review["expertFeedback"] }) {
  const [active, setActive] = useState(feedback[0]?.expertId ?? "investor");
  const activeFb = feedback.find((f) => f.expertId === active)!;
  const activeExpert = experts.find((e) => e.id === active)!;

  return (
    <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            Expert Board
          </div>
          <div className="font-display text-2xl italic">Six verdicts. One report.</div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success animate-pulse-glow" />
          All agents responded
        </div>
      </div>

      <div className="grid grid-cols-6 border-b border-border">
        {experts.map((e, i) => {
          const isActive = e.id === active;
          const Icon = e.icon;
          return (
            <button
              key={e.id}
              onClick={() => setActive(e.id)}
              className={`group relative flex flex-col items-center gap-2 px-3 py-5 border-r last:border-r-0 border-border transition-all ${
                isActive ? "bg-secondary/60" : "hover:bg-secondary/30"
              }`}
              style={{ animation: `rise 0.5s ${i * 80}ms cubic-bezier(0.16,1,0.3,1) both` }}
            >
              {isActive && (
                <span
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${e.color}, transparent)` }}
                />
              )}
              <div
                className="relative size-12 rounded-full grid place-items-center border transition-transform group-hover:scale-105"
                style={{
                  borderColor: isActive ? e.color : "oklch(1 0 0 / 0.08)",
                  background: `radial-gradient(circle at 30% 30%, ${e.color}33, transparent 70%)`,
                  boxShadow: isActive ? `0 0 24px ${e.color}55` : "none",
                }}
              >
                <Icon className="size-5" style={{ color: e.color }} />
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-card"
                    style={{ background: e.color }}
                  />
                )}
              </div>
              <div className="text-center">
                <div className={`text-[11px] font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {e.role.replace(" Agent", "")}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">
                  {e.name.split(" ")[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div key={active} className="p-6 md:p-8 animate-rise">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="md:w-48 shrink-0 space-y-3">
            <div
              className="aspect-square w-full rounded-xl border relative overflow-hidden"
              style={{
                borderColor: `${activeExpert.color}44`,
                background: `radial-gradient(circle at 30% 30%, ${activeExpert.color}33, oklch(0.16 0.018 265))`,
              }}
            >
              <activeExpert.icon
                className="absolute inset-0 m-auto size-20 opacity-90"
                style={{ color: activeExpert.color }}
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-card to-transparent">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {activeExpert.role}
                </div>
                <div className="font-display text-lg leading-tight">{activeExpert.name}</div>
              </div>
            </div>
            <div className="space-y-1">
              {activeExpert.focus.map((f) => (
                <div key={f} className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <span className="size-1 rounded-full" style={{ background: activeExpert.color }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.22em] px-2 py-1 rounded-full border"
                style={{ borderColor: `${activeExpert.color}55`, color: activeExpert.color, background: `${activeExpert.color}14` }}
              >
                {activeFb.rating}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">{activeFb.signal}</span>
            </div>
            <h3 className="font-display text-3xl leading-tight tracking-tight mb-4">
              {activeFb.headline}
            </h3>
            <div className="relative pl-6 text-[15px] leading-relaxed text-muted-foreground">
              <Quote className="absolute left-0 top-1 size-4" style={{ color: activeExpert.color }} />
              {activeFb.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
