import { TrendingUp, TrendingDown } from "lucide-react";

export function ScoreCard({
  label,
  value,
  delta,
  accent = "primary",
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
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition hover:border-border/80 hover:bg-card">
      <div
        className="absolute inset-x-0 -top-px h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </div>
        {delta !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-[11px] font-medium ${
              delta >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {delta > 0 ? "+" : ""}
            {delta}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl tracking-tight" style={{ color }}>
          {value}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, oklch(0.78 0.14 195))` }}
        />
      </div>
    </div>
  );
}
