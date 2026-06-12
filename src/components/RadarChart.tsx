import {
  Radar,
  RadarChart as RRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function RadarChart({
  data,
}: {
  data: { dimension: string; score: number; benchmark: number }[];
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RRadar data={data} outerRadius="78%">
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.19 268)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="oklch(0.78 0.14 195)" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "oklch(0.66 0.02 265)", fontSize: 11, fontFamily: "Inter" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "oklch(0.5 0.02 265)", fontSize: 9 }}
            stroke="oklch(1 0 0 / 0.08)"
          />
          <Radar
            name="Benchmark"
            dataKey="benchmark"
            stroke="oklch(0.5 0.02 265)"
            fill="oklch(0.5 0.02 265)"
            fillOpacity={0.1}
            strokeDasharray="4 4"
          />
          <Radar
            name="Your Product"
            dataKey="score"
            stroke="oklch(0.7 0.19 268)"
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={1}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "oklch(0.66 0.02 265)" }}
          />
        </RRadar>
      </ResponsiveContainer>
    </div>
  );
}
