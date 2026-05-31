"use client";

import { useState } from "react";

/**
 * Interactive recreation of the thesis conceptual model as a scalable SVG
 * flowchart: three trust challenges branch from "AI-generated Reels" and flow
 * along lines into "Gen Z brand trust", each with Responsible-AI moderators
 * dropping onto the line and a contradiction pushing up from below.
 * Every node is hoverable / focusable and reveals a plain-language explanation.
 */

const VW = 1500;
const VH = 600;

type LaneId = "authenticity" | "bias" | "ip";
const COLOR: Record<LaneId, string> = {
  authenticity: "#1f3551", // blue-opal
  bias: "#704b2c", // toffee
  ip: "#6e2934", // syrah
};

interface Mod {
  label: string;
  theorised?: boolean;
  tip: string;
}
interface Lane {
  id: LaneId;
  y: number;
  challenge: string;
  challengeTip: string;
  mods: Mod[];
  contradiction: string;
  contradictionTip: string;
}

const LANES: Lane[] = [
  {
    id: "authenticity",
    y: 130,
    challenge: "Perceived reduced authenticity",
    challengeTip:
      "When AI makes a Reel feel less genuine, Gen Z can trust the brand less. The challenge closest to respondents' daily work; it came up in every interview.",
    mods: [
      { label: "Autonomy", theorised: true, tip: "Theorised in the literature: keeping humans in clear creative control of AI output." },
      { label: "Human craft", tip: "Visible human work in the Reel (a real face, hands, location or performance). The strongest authenticity lever in the data." },
      { label: "Original creativity", tip: "A distinctive idea from your team, not a generic AI default. A strong idea overrides concerns about how it was made." },
      { label: "Use-case fit", tip: "AI is tolerated in lower-funnel content (product, promo, humour) but penalised in upper-funnel brand-building." },
    ],
    contradiction: "Authenticity paradox",
    contradictionTip:
      "Seven respondents pushed back: Gen Z says it wants 'real' but engages with AI influencers anyway. The penalty may be transitional, not permanent.",
  },
  {
    id: "bias",
    y: 300,
    challenge: "Perceived algorithmic bias",
    challengeTip:
      "AI can reproduce stereotypes and blind spots, like defaulting to one ethnicity, or missing Ramadan or a regional identity.",
    mods: [
      { label: "Nonbiasedness", theorised: true, tip: "Theorised in the literature: actively keeping AI output free of discriminatory patterns and representative across groups." },
      { label: "Critical thinking", tip: "Checking your own brief and prompts for bias, not just the AI's output. The strongest single theme in the whole study." },
      { label: "Brand-audience fit", tip: "Whether the people shown match the real audience you serve. A broad or purpose-led brand is held to a higher bar." },
    ],
    contradiction: "Upstream bias",
    contradictionTip:
      "Four respondents argued the bias isn't in the AI but in the marketer's brief and the training data: 'the marketer puts the bias in there.'",
  },
  {
    id: "ip",
    y: 470,
    challenge: "Perceived IP concerns",
    challengeTip:
      "AI trained on others' work raises credit, consent and compensation questions about whose work and likeness it draws on.",
    mods: [
      { label: "Crediting", theorised: true, tip: "Theorised in the literature, expanded by respondents into a 'triple-C': credit, consent and compensation." },
      { label: "Creator collaboration", tip: "Paying or partnering with the creators whose work the AI draws on, turning displacement into partnership." },
      { label: "Provenance", tip: "Being able to trace which tool and data source produced the AI assets, and using ethically-sourced tools." },
      { label: "Legal guardrails", tip: "A legal or brand check that keeps protected names, real people and landmarks out of prompts." },
    ],
    contradiction: "IP indifference",
    contradictionTip:
      "Four respondents said most Gen Z don't think about training data until a case becomes visible: 'nobody cares,' until a lawsuit or viral disclosure.",
  },
];

// geometry
const CH_X = 300;
const CH_W = 250;
const CH_H = 56;
const BUS_X = 1235;
const TRUST = { x: 1280, y: 255, w: 200, h: 90 };
const SRC = { x: 24, y: 268, w: 176, h: 64 };
const MOD_BAND_X = 600;
const MOD_H = 36;

const pillW = (label: string, star?: boolean) =>
  Math.max(82, label.length * 7.6 + 30 + (star ? 16 : 0));

interface Hover {
  tip: string;
  xPct: number;
  yPct: number;
  below: boolean;
}

export function ConceptualModel() {
  const [hover, setHover] = useState<Hover | null>(null);

  const enter = (tip: string, cx: number, cy: number) =>
    setHover({
      tip,
      xPct: (cx / VW) * 100,
      yPct: (cy / VH) * 100,
      below: cy < VH * 0.45,
    });
  const leave = () => setHover(null);

  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-black/5 sm:p-6">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Conceptual model: three trust challenges flowing into Gen Z brand trust"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#5b5560" />
            </marker>
            {(["authenticity", "bias", "ip"] as LaneId[]).map((id) => (
              <marker key={id} id={`arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill={COLOR[id]} />
              </marker>
            ))}
          </defs>

          {/* dashed branches from source to each challenge */}
          {LANES.map((lane) => (
            <path
              key={`br-${lane.id}`}
              d={`M ${SRC.x + SRC.w} ${SRC.y + SRC.h / 2} C ${CH_X - 60} ${SRC.y + SRC.h / 2}, ${CH_X - 60} ${lane.y}, ${CH_X} ${lane.y}`}
              fill="none"
              stroke="#b9b3ab"
              strokeWidth={2}
              strokeDasharray="6 5"
              markerEnd="url(#arrow)"
            />
          ))}

          {/* challenge -> trust lines + right bus */}
          {LANES.map((lane) => (
            <line
              key={`ln-${lane.id}`}
              x1={CH_X + CH_W}
              y1={lane.y}
              x2={BUS_X}
              y2={lane.y}
              stroke="#5b5560"
              strokeWidth={2}
            />
          ))}
          <line x1={BUS_X} y1={LANES[0].y} x2={BUS_X} y2={LANES[2].y} stroke="#5b5560" strokeWidth={2} />
          <line x1={BUS_X} y1={300} x2={TRUST.x} y2={300} stroke="#5b5560" strokeWidth={2} markerEnd="url(#arrow)" />

          {/* per-lane: moderator ticks, contradiction arrow */}
          {LANES.map((lane) => {
            const modY = lane.y - 96;
            // lay out moderator pills left to right
            let x = MOD_BAND_X;
            const pills = lane.mods.map((m) => {
              const w = pillW(m.label, m.theorised);
              const node = { ...m, x, w, cx: x + w / 2 };
              x += w + 14;
              return node;
            });
            return (
              <g key={`g-${lane.id}`}>
                {/* moderator down-ticks */}
                {pills.map((p) => (
                  <line
                    key={`tick-${p.label}`}
                    x1={p.cx}
                    y1={modY + MOD_H}
                    x2={p.cx}
                    y2={lane.y}
                    stroke="#5b5560"
                    strokeWidth={2}
                    markerEnd="url(#arrow)"
                  />
                ))}
                {/* contradiction up-arrow */}
                <line
                  x1={CH_X + CH_W / 2}
                  y1={lane.y + CH_H / 2 + 52}
                  x2={CH_X + CH_W / 2}
                  y2={lane.y + CH_H / 2}
                  stroke={COLOR[lane.id]}
                  strokeWidth={2}
                  markerEnd={`url(#arrow-${lane.id})`}
                />

                {/* moderator pills */}
                {pills.map((p) => (
                  <NodeRect
                    key={`mod-${p.label}`}
                    x={p.x}
                    y={modY}
                    w={p.w}
                    h={MOD_H}
                    rx={MOD_H / 2}
                    fill={p.theorised ? COLOR[lane.id] : "#ffffff"}
                    stroke={COLOR[lane.id]}
                    textColor={p.theorised ? "#ffffff" : "#1c1a1a"}
                    label={p.theorised ? `${p.label} ★` : p.label}
                    fontSize={15}
                    onEnter={() => enter(p.tip, p.cx, modY)}
                    onLeave={leave}
                  />
                ))}

                {/* contradiction pill */}
                <NodeRect
                  x={CH_X + 6}
                  y={lane.y + CH_H / 2 + 52}
                  w={CH_W - 12}
                  h={36}
                  rx={18}
                  fill="#ffffff"
                  stroke={COLOR[lane.id]}
                  dashed
                  textColor={COLOR[lane.id]}
                  label={lane.contradiction}
                  fontSize={15}
                  onEnter={() => enter(lane.contradictionTip, CH_X + CH_W / 2, lane.y + CH_H / 2 + 70)}
                  onLeave={leave}
                />

                {/* challenge box */}
                <NodeRect
                  x={CH_X}
                  y={lane.y - CH_H / 2}
                  w={CH_W}
                  h={CH_H}
                  rx={12}
                  fill={COLOR[lane.id]}
                  stroke={COLOR[lane.id]}
                  textColor="#ffffff"
                  label={lane.challenge}
                  fontSize={16}
                  bold
                  onEnter={() => enter(lane.challengeTip, CH_X + CH_W / 2, lane.y)}
                  onLeave={leave}
                />
              </g>
            );
          })}

          {/* source */}
          <NodeRect
            x={SRC.x}
            y={SRC.y}
            w={SRC.w}
            h={SRC.h}
            rx={12}
            fill="#ffffff"
            stroke="#b9b3ab"
            dashed
            textColor="#3b3537"
            label="AI-generated Instagram Reels advertising"
            fontSize={14}
            wrap
            onEnter={() => enter("The starting point: a brand using Generative AI to make Instagram Reels for a Gen Z audience.", SRC.x + SRC.w / 2, SRC.y + SRC.h + 6)}
            onLeave={leave}
          />

          {/* outcome */}
          <NodeRect
            x={TRUST.x}
            y={TRUST.y}
            w={TRUST.w}
            h={TRUST.h}
            rx={14}
            fill="#cdd6e3"
            stroke="#cdd6e3"
            textColor="#142235"
            label="Gen Z brand trust"
            fontSize={17}
            bold
            onEnter={() => enter("The outcome the whole model explains: whether Gen Z keeps trusting the brand after seeing AI used in its Reels.", TRUST.x + TRUST.w / 2, TRUST.y)}
            onLeave={leave}
          />
        </svg>

        {/* hover tooltip overlay */}
        {hover && (
          <div
            className="pointer-events-none absolute z-30 w-56 -translate-x-1/2 rounded-xl bg-[var(--color-blue-opal-deep)] px-3 py-2 text-[12.5px] leading-snug text-white shadow-[0_16px_40px_-18px_rgba(0,0,0,0.6)]"
            style={{
              left: `${Math.min(90, Math.max(10, hover.xPct))}%`,
              top: `${hover.yPct}%`,
              transform: hover.below
                ? "translate(-50%, 8px)"
                : "translate(-50%, calc(-100% - 8px))",
            }}
          >
            {hover.tip}
          </div>
        )}
      </div>

      {/* legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--color-skyway)]/30 pt-4 text-[12px] text-[var(--color-ink-soft)]/75">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-[var(--color-blue-opal)]" />
          Theorised moderator (from literature)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full border border-[var(--color-blue-opal)] bg-white" />
          Emergent moderator (from interviews)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full border border-dashed border-[var(--color-rythmic-red)] bg-white" />
          Contradiction
        </span>
        <span className="text-[var(--color-ink-soft)]/55">· Hover any box to read what it means.</span>
      </div>
    </div>
  );
}

function NodeRect({
  x,
  y,
  w,
  h,
  rx,
  fill,
  stroke,
  textColor,
  label,
  fontSize,
  bold,
  dashed,
  wrap,
  onEnter,
  onLeave,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  fill: string;
  stroke: string;
  textColor: string;
  label: string;
  fontSize: number;
  bold?: boolean;
  dashed?: boolean;
  wrap?: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  // simple two-line wrap for the source node
  const lines = wrap ? wrapText(label, 22) : [label];
  return (
    <g
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{ cursor: "help", outline: "none" }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      {lines.map((ln, i) => (
        <text
          key={i}
          x={cx}
          y={cy + (i - (lines.length - 1) / 2) * (fontSize + 3)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight={bold ? 600 : 500}
          fill={textColor}
          fontFamily="var(--font-grotesk), sans-serif"
        >
          {ln}
        </text>
      ))}
    </g>
  );
}

function wrapText(text: string, max: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur.trim());
  return lines;
}
