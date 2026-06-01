import {
  questionsBySection,
  sections,
  type Question,
  type Section,
  type SectionId,
} from "@/data/assessment";
import type { Answers } from "@/lib/scoring";

export type TeamStageId = SectionId;
export type TeamStageStatus = "done" | "active" | "locked";

export interface TeamStage {
  id: SectionId;
  title: string;
  subtitle: string;
  capability: string;
  accent: Section["accent"];
  questions: Question[];
  answered: number;
  total: number;
  status: TeamStageStatus;
}

const isAnswered = (a: Answers, q: Question): boolean => a[q.id] != null;

/**
 * Group the team questions into sequential, unlockable stages — one per trust
 * relationship. Mirrors the "Check a Reel" hub: the first unanswered section is
 * active, each later section unlocks once the previous one is fully answered.
 */
export function computeTeamStages(a: Answers): {
  stages: TeamStage[];
  allComplete: boolean;
  activeId: TeamStageId | null;
} {
  let prereqMet = true; // first section has no prerequisite
  let activeId: TeamStageId | null = null;

  const stages: TeamStage[] = sections.map((section) => {
    const questions = questionsBySection[section.id];
    const answered = questions.filter((q) => isAnswered(a, q)).length;
    const total = questions.length;

    let status: TeamStageStatus;
    if (total > 0 && answered === total) {
      status = "done";
    } else if (prereqMet) {
      status = "active";
    } else {
      status = "locked";
    }

    if (status === "active" && activeId === null) activeId = section.id;
    // prerequisite for the NEXT section is met only if this one is fully done
    if (status !== "done") prereqMet = false;

    return {
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      capability: section.capability,
      accent: section.accent,
      questions,
      answered,
      total,
      status,
    };
  });

  const allComplete = stages.every((s) => s.status === "done");

  return { stages, allComplete, activeId };
}
