"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { DimensionScore } from "@/lib/scoring";

interface RadarDatum {
  axis: string;
  short: string;
  critical: boolean;
  value: number;
}

type TickProps = {
  payload?: { value?: string };
  x?: number;
  y?: number;
  textAnchor?: "inherit" | "middle" | "start" | "end";
};

const renderAxisTick = (props: TickProps): React.ReactElement<SVGElement> => {
  const { payload, x = 0, y = 0, textAnchor } = props;
  const raw = payload?.value ?? "";
  const [labelPart, criticalFlag] = raw.split("|");
  const isCritical = criticalFlag === "1";
  const words = labelPart.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 14) {
      if (current) lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current.trim());

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={i * 12}
          textAnchor={textAnchor ?? "middle"}
          fontSize={11}
          fontFamily="var(--font-inter), sans-serif"
          fill={isCritical ? "var(--color-syrah-deep)" : "var(--color-ink-soft)"}
          fontWeight={isCritical ? 600 : 400}
        >
          {line}
        </text>
      ))}
      {isCritical && (
        <circle cx={0} cy={-8} r={2.5} fill="var(--color-rythmic-red)" />
      )}
    </g>
  );
};

export function ResultsRadar({ dimensions }: { dimensions: DimensionScore[] }) {
  const data: RadarDatum[] = dimensions.map((d) => ({
    axis: `${d.dimension.shortLabel}|${d.dimension.critical ? "1" : "0"}`,
    short: d.dimension.shortLabel,
    critical: d.dimension.critical,
    value: d.score ?? 0,
  }));

  return (
    <div className="aspect-square w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 24, right: 32, bottom: 24, left: 32 }} outerRadius="72%">
          <PolarGrid
            stroke="var(--color-skyway)"
            strokeOpacity={0.5}
            radialLines
          />
          <PolarAngleAxis dataKey="axis" tick={renderAxisTick} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--color-ink-soft)" }}
            stroke="var(--color-skyway)"
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="var(--color-syrah)"
            strokeWidth={2}
            fill="var(--color-syrah)"
            fillOpacity={0.28}
            isAnimationActive
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
