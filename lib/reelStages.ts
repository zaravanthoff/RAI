import {
  reelQuestions,
  visibleQuestions,
  type ReelAnswers,
  type ReelQuestion,
  type RelationshipId,
} from "@/data/reelCheck";

export type StageId = "scene" | RelationshipId;
export type StageStatus = "done" | "active" | "locked" | "skipped";

export interface Stage {
  id: StageId;
  title: string;
  blurb: string;
  questions: ReelQuestion[];
  answered: number;
  total: number;
  status: StageStatus;
}

const SCENE_IDS = ["ctx-funnel", "ctx-ai", "ctx-promise"];

const STAGE_META: { id: StageId; title: string; blurb: string }[] = [
  {
    id: "scene",
    title: "Set the scene",
    blurb: "A few quick questions about this Reel.",
  },
  {
    id: "authenticity",
    title: "Authenticity",
    blurb: "Does it still read as genuine to Gen Z?",
  },
  {
    id: "bias",
    title: "Algorithmic bias",
    blurb: "Who shows up, and who's missing?",
  },
  {
    id: "ip",
    title: "Intellectual property",
    blurb: "Credit, consent, and provenance.",
  },
];

const isAnswered = (a: ReelAnswers, q: ReelQuestion): boolean => {
  const v = a[q.id];
  return Array.isArray(v) ? v.length > 0 : v != null;
};

const sceneDone = (a: ReelAnswers): boolean => {
  const ai = a["ctx-ai"];
  if (!Array.isArray(ai) || ai.length === 0) return false;
  return SCENE_IDS.every((id) => a[id] != null);
};

/**
 * Group the adaptive questions into sequential, unlockable stages.
 * Scene first; then the three relationship stages unlock one after another.
 * A relationship with no relevant questions for this Reel is "skipped".
 */
export function computeStages(a: ReelAnswers): {
  stages: Stage[];
  allComplete: boolean;
  activeId: StageId | null;
} {
  const visible = visibleQuestions(a);
  const scene = sceneDone(a);

  const questionsFor = (id: StageId): ReelQuestion[] => {
    if (id === "scene") {
      return SCENE_IDS.map((qid) => reelQuestions.find((q) => q.id === qid)!).filter(
        Boolean,
      );
    }
    // relationship questions are only known once the scene is set
    if (!scene) return [];
    return visible.filter((q) => q.kind === "diagnostic" && q.relationship === id);
  };

  let prereqMet = true; // scene has no prerequisite
  let activeId: StageId | null = null;

  const stages: Stage[] = STAGE_META.map((meta) => {
    const questions = questionsFor(meta.id);
    const answered = questions.filter((q) => isAnswered(a, q)).length;
    const total = questions.length;

    let status: StageStatus;
    if (meta.id === "scene") {
      status = scene ? "done" : "active";
    } else if (!scene) {
      status = "locked";
    } else if (total === 0) {
      status = "skipped";
    } else if (answered === total) {
      status = "done";
    } else if (prereqMet) {
      status = "active";
    } else {
      status = "locked";
    }

    if (status === "active" && activeId === null) activeId = meta.id;
    // prerequisite for the NEXT stage is met only if this one is settled
    if (status !== "done" && status !== "skipped") prereqMet = false;

    return { ...meta, questions, answered, total, status };
  });

  const allComplete = stages.every(
    (s) => s.status === "done" || s.status === "skipped",
  );

  return { stages, allComplete, activeId };
}
