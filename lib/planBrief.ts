import {
  relationships,
  reelQuestions,
  visibleQuestions,
  type ReelAnswers,
  type RelationshipId,
} from "@/data/reelCheck";

// ─────────────────────────────────────────────────────────────────────────
// "Plan a Reel" turns the diagnostic on its head: instead of judging a finished
// Reel, it takes the same framing answers and produces a pre-production brief —
// the responsible-AI levers to build in *before* the Reel is made. The per-lever
// actions reuse the `fix` copy from the diagnostic, so there is one source of
// truth for what good practice looks like.
// ─────────────────────────────────────────────────────────────────────────

export interface PlanLever {
  dimensionLabel: string;
  tooltip?: string;
  action: string;
  critical: boolean;
}

export interface PlanGroup {
  id: RelationshipId;
  title: string;
  accent: "tawny-port" | "rythmic-red" | "toffee";
  levers: PlanLever[];
}

export interface FunnelStance {
  tone: "watch" | "ok" | "mixed";
  line: string;
}

export interface PlanBriefData {
  funnelStance: FunnelStance | null;
  groups: PlanGroup[];
  totalLevers: number;
  criticalCount: number;
}

/** The framing (context) questions, in order, shown before the brief. */
export const planContextQuestions = reelQuestions.filter(
  (q) => q.kind === "context",
);

function funnelStanceFor(a: ReelAnswers): FunnelStance | null {
  switch (a["ctx-funnel"]) {
    case "upper":
      return {
        tone: "watch",
        line: "This is upper-funnel brand-building, where AI carries the steepest trust penalty. Lean hard on visible human craft and a distinctive idea, and treat full end-to-end AI as the exception.",
      };
    case "lower":
      return {
        tone: "ok",
        line: "This is lower-funnel content, where AI is better tolerated, even welcomed. The bar is lower, but the levers below still protect trust.",
      };
    case "mixed":
      return {
        tone: "mixed",
        line: "This Reel mixes funnel stages. Treat its brand-building moments with upper-funnel caution: that's where AI costs the most trust.",
      };
    default:
      return null;
  }
}

export function buildPlanBrief(a: ReelAnswers): PlanBriefData {
  const diagnostics = visibleQuestions(a).filter((q) => q.kind === "diagnostic");

  const groups: PlanGroup[] = relationships
    .map((r) => ({
      id: r.id,
      title: r.title,
      accent: r.accent,
      levers: diagnostics
        .filter((q) => q.relationship === r.id)
        .map((q) => ({
          dimensionLabel: q.dimensionLabel ?? q.prompt,
          tooltip: q.tooltip,
          action: q.fix ?? "",
          critical: !!q.critical,
        }))
        .filter((l) => l.action),
    }))
    .filter((g) => g.levers.length > 0);

  const totalLevers = groups.reduce((n, g) => n + g.levers.length, 0);
  const criticalCount = groups.reduce(
    (n, g) => n + g.levers.filter((l) => l.critical).length,
    0,
  );

  return {
    funnelStance: funnelStanceFor(a),
    groups,
    totalLevers,
    criticalCount,
  };
}

/** Have all framing questions been answered (ctx-ai is multi, so check length). */
export function planContextComplete(a: ReelAnswers): boolean {
  return planContextQuestions.every((q) => {
    const v = a[q.id];
    return Array.isArray(v) ? v.length > 0 : v != null;
  });
}
