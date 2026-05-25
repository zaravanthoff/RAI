import {
  dimensions,
  dimensionsBySection,
  questions,
  questionsByDimension,
  sections,
  type Dimension,
  type SectionId,
} from "@/data/assessment";

export type LikertValue = 1 | 2 | 3 | 4 | 5;
export type Answer = LikertValue | "unsure" | null;
export type Answers = Record<string, Answer>;

export interface DimensionScore {
  dimension: Dimension;
  /** 0-100 or null if no scoreable answers */
  score: number | null;
  /** count of scoreable (non-"unsure", non-null) answers */
  answered: number;
  total: number;
}

export interface SectionScore {
  sectionId: SectionId;
  score: number | null;
  dimensions: DimensionScore[];
}

export interface AssessmentResult {
  overall: number | null;
  band: Band | null;
  dimensions: DimensionScore[];
  sections: SectionScore[];
  topRecommendations: DimensionScore[];
  topStrengths: DimensionScore[];
}

export type BandKey = "exposed" | "developing" | "practising" | "embedded";

export interface Band {
  key: BandKey;
  label: string;
  range: [number, number];
  oneLiner: string;
}

const BANDS: Band[] = [
  {
    key: "exposed",
    label: "Exposed",
    range: [0, 40],
    oneLiner:
      "AI is producing your Reels faster than your team is producing the practices that make them trustworthy.",
  },
  {
    key: "developing",
    label: "Developing",
    range: [41, 60],
    oneLiner:
      "Some moderators are in place, but the practice depends on individuals rather than a system.",
  },
  {
    key: "practising",
    label: "Practising",
    range: [61, 80],
    oneLiner:
      "The critical moderators are routine, with clear gaps left to close.",
  },
  {
    key: "embedded",
    label: "Embedded",
    range: [81, 100],
    oneLiner:
      "Responsible AI in Reels is a property of how the team works, not of any one person on it.",
  },
];

const CRITICAL_WEIGHT = 1.5;
const STANDARD_WEIGHT = 1.0;

const likertToPercent = (v: LikertValue): number => ((v - 1) / 4) * 100;

const scoreDimension = (dim: Dimension, answers: Answers): DimensionScore => {
  const dimQuestions = questionsByDimension[dim.id] ?? [];
  const scoreable: number[] = [];
  for (const q of dimQuestions) {
    const a = answers[q.id];
    if (a !== null && a !== undefined && a !== "unsure") {
      scoreable.push(likertToPercent(a));
    }
  }
  return {
    dimension: dim,
    score:
      scoreable.length === 0
        ? null
        : scoreable.reduce((s, x) => s + x, 0) / scoreable.length,
    answered: scoreable.length,
    total: dimQuestions.length,
  };
};

const weighted = (entries: DimensionScore[]): number | null => {
  const valid = entries.filter((e): e is DimensionScore & { score: number } =>
    typeof e.score === "number",
  );
  if (valid.length === 0) return null;
  let num = 0;
  let den = 0;
  for (const e of valid) {
    const w = e.dimension.critical ? CRITICAL_WEIGHT : STANDARD_WEIGHT;
    num += e.score * w;
    den += w;
  }
  return num / den;
};

const bandFor = (score: number): Band => {
  for (const b of BANDS) {
    if (score >= b.range[0] && score <= b.range[1]) return b;
  }
  return BANDS[BANDS.length - 1];
};

export function scoreAssessment(answers: Answers): AssessmentResult {
  const dimensionScores: DimensionScore[] = dimensions.map((d) =>
    scoreDimension(d, answers),
  );
  const byId = new Map(dimensionScores.map((d) => [d.dimension.id, d]));

  const sectionScores: SectionScore[] = sections.map((s) => {
    const dimList = dimensionsBySection[s.id].map((d) => byId.get(d.id)!);
    return {
      sectionId: s.id,
      score: weighted(dimList),
      dimensions: dimList,
    };
  });

  const overall = weighted(dimensionScores);

  const ranked = dimensionScores
    .filter((d): d is DimensionScore & { score: number } => typeof d.score === "number")
    .sort((a, b) => a.score - b.score);

  const topRecommendations = ranked.slice(0, 3);
  const topStrengths = [...ranked].reverse().slice(0, 3);

  return {
    overall,
    band: overall === null ? null : bandFor(overall),
    dimensions: dimensionScores,
    sections: sectionScores,
    topRecommendations,
    topStrengths,
  };
}

export function progressFraction(answers: Answers): number {
  const total = questions.length;
  let touched = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (a !== null && a !== undefined) touched += 1;
  }
  return total === 0 ? 0 : touched / total;
}

export function isSectionComplete(sectionId: SectionId, answers: Answers): boolean {
  const dimList = dimensionsBySection[sectionId];
  for (const d of dimList) {
    const qs = questionsByDimension[d.id];
    for (const q of qs) {
      const a = answers[q.id];
      if (a === null || a === undefined) return false;
    }
  }
  return true;
}

export function isAssessmentComplete(answers: Answers): boolean {
  return sections.every((s) => isSectionComplete(s.id, answers));
}

export { BANDS };
