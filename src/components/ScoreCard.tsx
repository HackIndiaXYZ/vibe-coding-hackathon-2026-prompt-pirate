import { TrendingUp, TrendingDown } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

export function ScoreCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: number;
  delta?: number;
  accent?: "primary" | "accent" | "success" | "warning" | "destructive";
}) {
  const tone =
    value >= 85 ? "success" : value >= 70 ? "primary" : value >= 55 ? "warning" : "destructive";
  const colorMap: Record<string, string> = {
    primary: "oklch(0.7 0.19 268)",
    accent: "oklch(0.78 0.14 195)",
    success: "oklch(0.74 0.16 158)",
    warning: "oklch(0.78 0.16 75)",
    destructive: "oklch(0.66 0.22 22)",
  };
  const color = colorMap[tone];
  const { value: animated, ref } = useCountUp(value, 1100);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-card hover:-translate-y-0.5 hover:shadow-elevated">
      <div
        className="absolute inset-x-0 -top-px h-px opacity-60 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}1a, transparent 60%)` }}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground line-clamp-2 min-h-[2em]">
          {label}
        </div>
        {delta !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-[11px] font-medium shrink-0 ${
              delta >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {delta > 0 ? "+" : ""}
            {delta}
          </div>
        )}
      </div>
      <div className="relative mt-3 sm:mt-4 flex items-baseline gap-1">
        <span
          ref={ref}
          className="font-display text-3xl sm:text-4xl tracking-tight tabular-nums"
          style={{ color }}
        >
          {animated}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      <div className="relative mt-3 sm:mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-[width] duration-[1400ms] ease-out"
          style={{
            width: `${animated}%`,
            background: `linear-gradient(90deg, ${color}, oklch(0.78 0.14 195))`,
          }}
        />
      </div>
    </div>
  );
}
