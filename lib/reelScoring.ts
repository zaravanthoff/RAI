import {
  nuanceNotes,
  reelDiagnostics,
  relationships,
  visibleQuestions,
  type NuanceNote,
  type ReelAnswers,
  type ReelQuestion,
  type RelationshipId,
} from "@/data/reelCheck";

const CRITICAL_WEIGHT = 1.5;
const STANDARD_WEIGHT = 1.0;

export type Verdict = "ship" | "caution" | "rework";

export interface ScoredDiagnostic {
  question: ReelQuestion;
  /** 0–100, or null when answered "N/A" / unanswered. */
  score: number | null;
}

export interface RelationshipScore {
  relationship: RelationshipId;
  title: string;
  score: number | null; // null when no relevant diagnostics applied
  diagnostics: ScoredDiagnostic[];
}

export interface ReelResult {
  overall: number | null;
  verdict: Verdict | null;
  verdictLine: string;
  relationshipScores: RelationshipScore[];
  /** Lowest-scoring relevant gaps, worst first, for the "top risks" block. */
  topRisks: ScoredDiagnostic[];
  /** Every relevant gap (score < 100), for the full fix-it checklist. */
  checklist: ScoredDiagnostic[];
  notes: NuanceNote[];
  answeredCount: number;
  relevantCount: number;
}

const optionScore = (q: ReelQuestion, answerId: string | undefined): number | null => {
  if (!answerId) return null;
  const opt = q.options.find((o) => o.id === answerId);
  if (!opt) return null;
  return opt.score ?? null; // `null` (N/A) excluded
};

const weightedMean = (entries: ScoredDiagnostic[]): number | null => {
  const valid = entries.filter(
    (e): e is ScoredDiagnostic & { score: number } => typeof e.score === "number",
  );
  if (valid.length === 0) return null;
  let num = 0;
  let den = 0;
  for (const e of valid) {
    const w = e.question.critical ? CRITICAL_WEIGHT : STANDARD_WEIGHT;
    num += e.score * w;
    den += w;
  }
  return num / den;
};

const VERDICT_LINES: Record<Verdict, string> = {
  ship: "This Reel reflects the practices the study links to maintained Gen Z trust. Publish, and protect what's working.",
  caution:
    "Publishable, but there are real gaps. Close the risks below before this becomes a habit across your Reels.",
  rework:
    "Hold publishing. This Reel carries trust risks the study found Gen Z react to. Address the flagged items first.",
};

export function scoreReel(answers: ReelAnswers): ReelResult {
  const visible = visibleQuestions(answers);
  const relevantDiag = visible.filter((q) => q.kind === "diagnostic");
  const relevantIds = new Set(relevantDiag.map((q) => q.id));

  const scored: ScoredDiagnostic[] = relevantDiag.map((q) => ({
    question: q,
    score: optionScore(q, answers[q.id] as string | undefined),
  }));

  const relationshipScores: RelationshipScore[] = relationships.map((rel) => {
    const diags = scored.filter((s) => s.question.relationship === rel.id);
    return {
      relationship: rel.id,
      title: rel.title,
      score: weightedMean(diags),
      diagnostics: diags,
    };
  });

  // Overall = weighted mean of relationship scores. Authenticity is weighted up
  // for upper-funnel Reels (use-case fit: the penalty is steeper there).
  const relWeights: Record<RelationshipId, number> = {
    authenticity: answers["ctx-funnel"] === "upper" ? 1.5 : 1.0,
    bias: 1.0,
    ip: 1.0,
  };
  let oNum = 0;
  let oDen = 0;
  for (const rs of relationshipScores) {
    if (typeof rs.score === "number") {
      const w = relWeights[rs.relationship];
      oNum += rs.score * w;
      oDen += w;
    }
  }
  const overall = oDen === 0 ? null : oNum / oDen;

  // Critical red flags = relevant critical diagnostics answered "No" (score 0).
  const criticalReds = scored.filter(
    (s) => s.question.critical && s.score === 0,
  ).length;

  let verdict: Verdict | null = null;
  if (overall !== null) {
    if (overall < 45 || criticalReds >= 2) verdict = "rework";
    else if (overall >= 75 && criticalReds === 0) verdict = "ship";
    else verdict = "caution";
  }

  // Risks & checklist: any relevant gap (scored, below full marks), worst first.
  // Critical dimensions sort ahead of standard ones at equal score.
  const gaps = scored
    .filter((s): s is ScoredDiagnostic & { score: number } =>
      typeof s.score === "number" && s.score < 100,
    )
    .sort(
      (a, b) =>
        a.score - b.score ||
        Number(b.question.critical) - Number(a.question.critical),
    );

  const scoresByRel: Partial<Record<RelationshipId, number | null>> = {};
  for (const rs of relationshipScores) scoresByRel[rs.relationship] = rs.score;
  const notes = nuanceNotes.filter((n) => n.appliesWhen(answers, scoresByRel));

  const answeredCount = scored.filter((s) => answers[s.question.id] != null).length;

  return {
    overall,
    verdict,
    verdictLine: verdict ? VERDICT_LINES[verdict] : "",
    relationshipScores,
    topRisks: gaps.slice(0, 3),
    checklist: gaps,
    notes,
    answeredCount,
    relevantCount: relevantIds.size,
  };
}

/** Has every currently-relevant question been answered? */
export function isReelComplete(answers: ReelAnswers): boolean {
  const visible = visibleQuestions(answers);
  // ctx-ai must have at least one selection before we can branch meaningfully.
  const ai = answers["ctx-ai"];
  if (!Array.isArray(ai) || ai.length === 0) return false;
  return visible.every((q) => {
    const v = answers[q.id];
    if (Array.isArray(v)) return v.length > 0;
    return v != null;
  });
}

export function reelProgress(answers: ReelAnswers): number {
  const visible = visibleQuestions(answers);
  if (visible.length === 0) return 0;
  let done = 0;
  for (const q of visible) {
    const v = answers[q.id];
    if (Array.isArray(v) ? v.length > 0 : v != null) done += 1;
  }
  return done / visible.length;
}

export { reelDiagnostics };
