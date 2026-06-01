import type { ReelAnswers } from "@/data/reelCheck";
import { planContextQuestions } from "./planBrief";

// ─────────────────────────────────────────────────────────────────────────
// "Plan a Reel" is no longer a card quiz like the other flows. It's an
// Instagram-style Reel Studio: the marketer composes the actual Reel they're
// about to make — the scene, caption, brand and hashtags — and the framing
// answers that drive the responsible-AI brief are collected *as part of
// composing*, not as an abstract survey. These keys store the free-text
// personalization alongside the existing ctx-* framing answers.
// ─────────────────────────────────────────────────────────────────────────

export const PLAN_KEYS = {
  handle: "brand-handle",
  brandType: "brand-type",
  desc: "video-desc",
  caption: "caption",
  hashtags: "hashtags",
} as const;

export interface BrandType {
  id: string;
  label: string;
  emoji: string;
  /** Maps to the ctx-promise framing answer that the brief logic reads. */
  promise: "yes" | "somewhat" | "no";
  /** Gradient painted behind the Reel scene in the preview. */
  scene: string;
  note: string;
}

export const brandTypes: BrandType[] = [
  {
    id: "human",
    label: "Human & authentic",
    emoji: "🫶",
    promise: "yes",
    scene: "linear-gradient(155deg,#6e2934 0%,#9c3d3d 55%,#704b2c 100%)",
    note: "Real, honest, visibly made by people",
  },
  {
    id: "nature",
    label: "Natural / sustainable",
    emoji: "🌿",
    promise: "yes",
    scene: "linear-gradient(155deg,#244033 0%,#3c6b4d 55%,#7b8f5a 100%)",
    note: "Eco, calm, grounded in the real world",
  },
  {
    id: "community",
    label: "Community / culture",
    emoji: "✨",
    promise: "somewhat",
    scene: "linear-gradient(155deg,#1f3551 0%,#6e2934 65%,#9c3d3d 100%)",
    note: "Local, social, of-the-moment",
  },
  {
    id: "lifestyle",
    label: "Lifestyle / fashion",
    emoji: "👗",
    promise: "somewhat",
    scene: "linear-gradient(155deg,#704b2c 0%,#ddb58d 55%,#9c3d3d 100%)",
    note: "Aspirational, styled, aesthetic",
  },
  {
    id: "product",
    label: "Product / performance",
    emoji: "🛒",
    promise: "no",
    scene: "linear-gradient(155deg,#1f3551 0%,#142235 60%,#3b3537 100%)",
    note: "Promo, deals, clear and useful",
  },
  {
    id: "tech",
    label: "Tech / futuristic",
    emoji: "🚀",
    promise: "no",
    scene: "linear-gradient(155deg,#142235 0%,#1f3551 50%,#6e2934 100%)",
    note: "Innovative, sleek, AI-forward",
  },
];

export function brandTypeOf(a: ReelAnswers): BrandType | undefined {
  return brandTypes.find((b) => b.id === a[PLAN_KEYS.brandType]);
}

const funnelQ = planContextQuestions.find((q) => q.id === "ctx-funnel")!;
const aiQ = planContextQuestions.find((q) => q.id === "ctx-ai")!;
export const funnelOptions = funnelQ.options;
export const aiOptions = aiQ.options;

/** Compact emoji + label for the multi-select AI chips. */
export const aiPartMeta: Record<string, { emoji: string; short: string }> = {
  people: { emoji: "🧑", short: "People & faces" },
  voice: { emoji: "🎙️", short: "Voice / audio" },
  video: { emoji: "🎬", short: "Full video" },
  music: { emoji: "🎵", short: "Music / sound" },
  concept: { emoji: "💡", short: "Idea / script" },
  style: { emoji: "🎨", short: "An artist's style" },
  edit: { emoji: "✂️", short: "Editing only" },
};

export const funnelMeta: Record<string, { emoji: string; short: string }> = {
  upper: { emoji: "✨", short: "Brand-building" },
  lower: { emoji: "🛒", short: "Product / promo" },
  mixed: { emoji: "🔀", short: "A bit of both" },
};

// ── Small accessors over the loosely-typed answer bag ─────────────────────
export const planStr = (a: ReelAnswers, key: string): string =>
  typeof a[key] === "string" ? (a[key] as string) : "";
export const planArr = (a: ReelAnswers, key: string): string[] =>
  Array.isArray(a[key]) ? (a[key] as string[]) : [];

/** Readiness meter for the studio: how fleshed-out the Reel is. */
export function planReadiness(a: ReelAnswers): {
  pct: number;
  canGenerate: boolean;
} {
  const checks: boolean[] = [
    !!a[PLAN_KEYS.brandType],
    planStr(a, PLAN_KEYS.desc).trim().length > 3,
    !!a["ctx-funnel"],
    planArr(a, "ctx-ai").length > 0,
    planStr(a, PLAN_KEYS.caption).trim().length > 0,
    planArr(a, PLAN_KEYS.hashtags).length > 0,
  ];
  // The first four are required before a brief can be generated.
  const canGenerate = checks.slice(0, 4).every(Boolean);
  const done = checks.filter(Boolean).length;
  return { pct: (done / checks.length) * 100, canGenerate };
}
