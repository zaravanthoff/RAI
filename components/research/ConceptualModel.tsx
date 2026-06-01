"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

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

/**
 * Guided walkthrough. Each step spotlights one part of the model (dimming the
 * rest) and narrates the flow: source → three challenges → each challenge's
 * moderators (calling out the emergent ones) → counter-voices → outcome.
 * `active` tokens: "source", "outcome", "ch:<lane>", "con:<lane>", or
 * "mods:<lane>" (matches every moderator pill in that lane).
 */
interface TourStep {
  title: string;
  body: string;
  active: string[];
}

const LANE_INTRO: Record<LaneId, { n: number; body: string; softens: string }> = {
  authenticity: {
    n: 1,
    body: "When AI makes a Reel feel less genuine, Gen Z can trust the brand less. This was the challenge closest to respondents' daily work — it came up in every interview.",
    softens: "Four moderators can soften this. The one marked ★ comes from the literature; the other three emerged from the interviews. Here's each in turn.",
  },
  bias: {
    n: 2,
    body: "AI can reproduce stereotypes and blind spots — defaulting to one ethnicity, or missing Ramadan or a regional identity.",
    softens: "Three moderators can soften this. The one marked ★ comes from the literature; the other two emerged from the interviews. Here's each in turn.",
  },
  ip: {
    n: 3,
    body: "AI trained on other people's work raises questions of credit, consent and compensation — about whose work and likeness it draws on.",
    softens: "Four moderators can soften this. The one marked ★ comes from the literature; the other three emerged from the interviews. Here's each in turn.",
  },
};

// Build the walkthrough from the model data so moderator copy stays in one place:
// source → 3 challenges → (per lane: challenge → each moderator → counter-voice) → outcome.
function buildTour(): TourStep[] {
  const steps: TourStep[] = [
    {
      title: "Where it all starts",
      body: "The whole model starts from a single point: a brand using Generative AI to make Instagram Reels for a Gen Z audience.",
      active: ["source"],
    },
    {
      title: "Three challenges to trust",
      body: "Using AI this way raises three distinct challenges — reduced authenticity, algorithmic bias and IP concerns. Each one can chip away at brand trust.",
      active: ["ch:authenticity", "ch:bias", "ch:ip"],
    },
  ];

  for (const lane of LANES) {
    const intro = LANE_INTRO[lane.id];
    steps.push({
      title: `${intro.n} · ${lane.challenge}`,
      body: intro.body,
      active: [`ch:${lane.id}`],
    });
    steps.push({
      title: "What can soften it",
      body: intro.softens,
      active: [`mods:${lane.id}`],
    });
    for (const m of lane.mods) {
      steps.push({
        title: `${m.label} · ${m.theorised ? "from the literature ★" : "emergent (from interviews)"}`,
        body: m.tip,
        active: [`mod:${lane.id}:${m.label}`],
      });
    }
    steps.push({
      title: "The counter-voice",
      body: lane.contradictionTip,
      active: [`con:${lane.id}`],
    });
  }

  steps.push({
    title: "It all lands here",
    body: "Each challenge, softened or not by these moderators, flows into the outcome the whole model explains: Gen Z brand trust. The takeaway — trust is driven by the practices brands put around the AI, not by AI use itself.",
    active: ["outcome", "ch:authenticity", "ch:bias", "ch:ip"],
  });

  return steps;
}

const TOUR: TourStep[] = buildTour();

const MIN_WIDTH = 480; // px — narrowest the card can be dragged

export function ConceptualModel() {
  const [hover, setHover] = useState<Hover | null>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  // ── Walkthrough ──────────────────────────────────────────────────────────
  const tourActive = tourStep !== null;
  const step = tourActive ? TOUR[tourStep] : null;
  const isSpot = (id: string) =>
    !!step &&
    step.active.some(
      (tok) =>
        tok === id ||
        (tok.startsWith("mods:") && id.startsWith(`mod:${tok.slice(5)}:`)),
    );
  const inStep = (tok: string) => !!step && step.active.includes(tok);
  const connOpacity = (bright: boolean) =>
    tourActive ? (bright ? 1 : 0.08) : 1;
  const startTour = () => {
    setHover(null);
    setTourStep(0);
  };
  const exitTour = () => setTourStep(null);
  const nextStep = () =>
    setTourStep((s) => (s === null ? 0 : Math.min(s + 1, TOUR.length - 1)));
  const prevStep = () =>
    setTourStep((s) => (s === null ? 0 : Math.max(s - 1, 0)));

  const onResizeMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !cardRef.current) return;
    // Card stays centred, so it grows symmetrically: the right edge tracks the
    // cursor while the centre (the page midpoint) stays fixed.
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const max = window.innerWidth - 32;
    setCardWidth(Math.min(max, Math.max(MIN_WIDTH, 2 * (e.clientX - centerX))));
  };

  const enter = (tip: string, cx: number, cy: number) =>
    setHover({
      tip,
      xPct: (cx / VW) * 100,
      yPct: (cy / VH) * 100,
      below: cy < VH * 0.45,
    });
  const leave = () => setHover(null);

  return (
    <div
      ref={cardRef}
      className="relative rounded-3xl bg-white p-4 ring-1 ring-black/5 sm:p-6"
      style={
        cardWidth != null
          ? { width: cardWidth, left: "50%", transform: "translateX(-50%)" }
          : undefined
      }
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        {!tourActive ? (
          <button
            type="button"
            onClick={startTour}
            className="lift group inline-flex items-center gap-2 rounded-full bg-[var(--color-syrah)] px-4 py-2 text-sm font-medium text-white shadow-[0_14px_30px_-16px_rgba(110,41,52,0.8)] transition hover:bg-[var(--color-syrah-deep)]"
          >
            <span
              aria-hidden
              className="grid size-5 place-items-center rounded-full bg-white/20 text-[10px] transition group-hover:bg-white/30"
            >
              ▶
            </span>
            Walk through the model
          </button>
        ) : (
          <span className="eyebrow text-[var(--color-syrah)]">
            Guided walkthrough
          </span>
        )}
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]/45">
          <span aria-hidden>↔</span> Drag the right edge to resize
        </span>
      </div>

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
              style={{
                opacity: connOpacity(inStep("source") || isSpot(`ch:${lane.id}`)),
                transition: "opacity 0.45s ease",
              }}
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
              style={{
                opacity: connOpacity(inStep("outcome")),
                transition: "opacity 0.45s ease",
              }}
            />
          ))}
          <line
            x1={BUS_X}
            y1={LANES[0].y}
            x2={BUS_X}
            y2={LANES[2].y}
            stroke="#5b5560"
            strokeWidth={2}
            style={{ opacity: connOpacity(inStep("outcome")), transition: "opacity 0.45s ease" }}
          />
          <line
            x1={BUS_X}
            y1={300}
            x2={TRUST.x}
            y2={300}
            stroke="#5b5560"
            strokeWidth={2}
            markerEnd="url(#arrow)"
            style={{ opacity: connOpacity(inStep("outcome")), transition: "opacity 0.45s ease" }}
          />

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
                    style={{
                      opacity: connOpacity(
                        inStep(`mods:${lane.id}`) ||
                          isSpot(`mod:${lane.id}:${p.label}`),
                      ),
                      transition: "opacity 0.45s ease",
                    }}
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
                  style={{
                    opacity: connOpacity(isSpot(`con:${lane.id}`)),
                    transition: "opacity 0.45s ease",
                  }}
                />

                {/* moderator pills */}
                {pills.map((p) => {
                  const id = `mod:${lane.id}:${p.label}`;
                  return (
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
                      dimmed={tourActive && !isSpot(id)}
                      spotlight={isSpot(id)}
                      onEnter={() => enter(p.tip, p.cx, modY)}
                      onLeave={leave}
                    />
                  );
                })}

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
                  dimmed={tourActive && !isSpot(`con:${lane.id}`)}
                  spotlight={isSpot(`con:${lane.id}`)}
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
                  dimmed={tourActive && !isSpot(`ch:${lane.id}`)}
                  spotlight={isSpot(`ch:${lane.id}`)}
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
            highlight="#8a8079"
            dimmed={tourActive && !isSpot("source")}
            spotlight={isSpot("source")}
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
            highlight="#1f3551"
            dimmed={tourActive && !isSpot("outcome")}
            spotlight={isSpot("outcome")}
            onEnter={() => enter("The outcome the whole model explains: whether Gen Z keeps trusting the brand after seeing AI used in its Reels.", TRUST.x + TRUST.w / 2, TRUST.y)}
            onLeave={leave}
          />
        </svg>

        {/* hover tooltip overlay (hidden during the guided walkthrough) */}
        {hover && !tourActive && (
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

      {/* legend / walkthrough narration */}
      {tourActive && step ? (
        <div
          key={tourStep}
          className="tour-card mt-5 border-t border-[var(--color-skyway)]/30 pt-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {TOUR.map((_, i) => (
                <span
                  key={i}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300",
                    i === tourStep
                      ? "w-6 bg-[var(--color-syrah)]"
                      : i < tourStep!
                        ? "w-1.5 bg-[var(--color-syrah)]/40"
                        : "w-1.5 bg-[var(--color-skyway)]/50",
                  ].join(" ")}
                />
              ))}
              <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]/50">
                {tourStep! + 1} / {TOUR.length}
              </span>
            </div>
            <button
              type="button"
              onClick={exitTour}
              className="text-[12px] text-[var(--color-ink-soft)]/60 transition hover:text-[var(--color-syrah)]"
            >
              Exit ✕
            </button>
          </div>

          <h4 className="font-display mt-3 text-xl text-[var(--color-syrah-deep)]">
            {step.title}
          </h4>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
            {step.body}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={tourStep === 0}
              className="lift inline-flex items-center gap-2 rounded-full border border-[var(--color-skyway)]/70 bg-white px-4 py-2 text-sm text-[var(--color-ink-soft)] transition hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={tourStep === TOUR.length - 1 ? exitTour : nextStep}
              className="lift inline-flex items-center gap-2 rounded-full bg-[var(--color-syrah)] px-5 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-syrah-deep)]"
            >
              {tourStep === TOUR.length - 1 ? "Done" : "Next"}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      ) : (
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
        </div>
      )}

      {/* drag-to-resize handle on the card's right edge */}
      <div
        role="separator"
        aria-label="Drag to resize the model"
        onPointerDown={(e) => {
          e.preventDefault();
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={onResizeMove}
        onPointerUp={(e) => {
          draggingRef.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onDoubleClick={() => setCardWidth(null)}
        title="Drag to resize · double-click to reset"
        className="group absolute -right-1.5 top-0 flex h-full w-6 cursor-ew-resize touch-none items-center justify-center"
      >
        <span className="h-20 w-1.5 rounded-full bg-[var(--color-skyway)]/60 transition-all group-hover:h-32 group-hover:bg-[var(--color-syrah)]" />
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
  highlight,
  dimmed,
  spotlight,
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
  /** Glow/border colour used while hovered or focused. Defaults to the stroke. */
  highlight?: string;
  /** Faded back during the walkthrough when another node is in focus. */
  dimmed?: boolean;
  /** In focus during the walkthrough: pulsing halo + scale-up. */
  spotlight?: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [active, setActive] = useState(false);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const hi = highlight ?? stroke;
  const lit = active || spotlight;
  // simple two-line wrap for the source node
  const lines = wrap ? wrapText(label, 22) : [label];
  return (
    <g
      tabIndex={0}
      onMouseEnter={() => {
        setActive(true);
        onEnter();
      }}
      onMouseLeave={() => {
        setActive(false);
        onLeave();
      }}
      onFocus={() => {
        setActive(true);
        onEnter();
      }}
      onBlur={() => {
        setActive(false);
        onLeave();
      }}
      style={{
        cursor: "help",
        outline: "none",
        opacity: dimmed ? 0.16 : 1,
        transformBox: "fill-box",
        transformOrigin: "center",
        transform: spotlight ? "scale(1.06)" : "scale(1)",
        transition: "opacity 0.45s ease, transform 0.45s var(--ease-out-expo)",
      }}
    >
      {/* highlight halo while hovered/focused or spotlit in the walkthrough */}
      {lit && (
        <rect
          x={x - 5}
          y={y - 5}
          width={w + 10}
          height={h + 10}
          rx={rx + 5}
          fill="none"
          stroke={hi}
          strokeWidth={3}
          opacity={0.4}
          className={spotlight && !active ? "tour-pulse" : undefined}
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={fill}
        stroke={lit ? hi : stroke}
        strokeWidth={lit ? 4 : 2}
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
