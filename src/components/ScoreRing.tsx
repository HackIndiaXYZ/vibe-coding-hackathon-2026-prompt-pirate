import { useCountUp } from "@/hooks/use-count-up";

export function ScoreRing({
  value,
  size = 160,
  stroke = 10,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const { value: animated, ref } = useCountUp(value, 1400);
  const offset = c - (animated / 100) * c;
  const gradId = `ring-grad-${label?.replace(/\s+/g, "-") ?? "x"}`;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.19 268)" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 195)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="oklch(1 0 0 / 0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          style={{
            transition: "stroke-dashoffset 0.05s linear",
            filter: "drop-shadow(0 0 12px oklch(0.7 0.19 268 / 0.35))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-4xl sm:text-5xl leading-none tracking-tight tabular-nums">
          <span ref={ref}>{animated}</span>
          <span className="text-sm sm:text-base text-muted-foreground font-sans align-top ml-0.5">
            /100
          </span>
        </div>
        {label && (
          <div className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground text-center px-2">
            {label}
          </div>
        )}
        {sublabel && <div className="text-xs text-success mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
}
