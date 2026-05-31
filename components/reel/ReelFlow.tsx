"use client";

import { useMemo, useState } from "react";
import type { ReelAnswers } from "@/data/reelCheck";
import { computeStages, type StageId } from "@/lib/reelStages";
import { ReelHub } from "./ReelHub";
import { ReelStage } from "./ReelStage";

/**
 * Orchestrates the "Check a Reel" experience as a hub of unlockable stages.
 * The hub is the home base; selecting a stage opens its questions, and
 * finishing returns to the hub with the next stage unlocked.
 */
export function ReelFlow({
  answers,
  onAnswer,
  onComplete,
  onExit,
}: {
  answers: ReelAnswers;
  onAnswer: (qid: string, value: string | string[]) => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [view, setView] = useState<"hub" | StageId>("hub");

  const { stages, allComplete } = useMemo(
    () => computeStages(answers),
    [answers],
  );

  if (view === "hub") {
    return (
      <ReelHub
        stages={stages}
        allComplete={allComplete}
        onSelectStage={(id) => {
          const s = stages.find((x) => x.id === id);
          if (s && (s.status === "active" || s.status === "done")) setView(id);
        }}
        onSeeVerdict={onComplete}
        onExit={onExit}
      />
    );
  }

  const stage = stages.find((s) => s.id === view);
  if (!stage || stage.questions.length === 0) {
    // nothing to ask (e.g. became irrelevant) — bounce back to the hub
    setView("hub");
    return null;
  }

  return (
    <ReelStage
      stage={stage}
      answers={answers}
      onAnswer={onAnswer}
      onBack={() => setView("hub")}
      onFinish={() => setView("hub")}
    />
  );
}
