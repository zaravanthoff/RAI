"use client";

import { useMemo, useState } from "react";
import type { Answer, Answers } from "@/lib/scoring";
import { computeTeamStages, type TeamStageId } from "@/lib/teamStages";
import { TeamHub } from "./TeamHub";
import { TeamStage } from "./TeamStage";

/**
 * Orchestrates the "Assess our team" experience as a hub of unlockable stages,
 * mirroring the "Check a Reel" flow. The hub is home base; selecting a section
 * opens its statements one at a time, and finishing returns to the hub with the
 * next section unlocked.
 */
export function TeamFlow({
  answers,
  onAnswer,
  onComplete,
  onExit,
}: {
  answers: Answers;
  onAnswer: (qid: string, value: Answer) => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [view, setView] = useState<"hub" | TeamStageId>("hub");

  const { stages, allComplete } = useMemo(
    () => computeTeamStages(answers),
    [answers],
  );

  if (view === "hub") {
    return (
      <TeamHub
        stages={stages}
        allComplete={allComplete}
        onSelectStage={(id) => {
          const s = stages.find((x) => x.id === id);
          if (s && (s.status === "active" || s.status === "done")) setView(id);
        }}
        onSeeResults={onComplete}
        onExit={onExit}
      />
    );
  }

  const stage = stages.find((s) => s.id === view);
  if (!stage || stage.questions.length === 0) {
    setView("hub");
    return null;
  }

  return (
    <TeamStage
      stage={stage}
      answers={answers}
      onAnswer={onAnswer}
      onBack={() => setView("hub")}
      onFinish={() => setView("hub")}
    />
  );
}
