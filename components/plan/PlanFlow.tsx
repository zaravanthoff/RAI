"use client";

import { useMemo, useState } from "react";
import type { ReelAnswers } from "@/data/reelCheck";
import { buildPlanBrief, planContextComplete } from "@/lib/planBrief";
import { planReadiness } from "@/lib/planComposer";
import { PlanComposer } from "./PlanComposer";
import { PlanBrief } from "./PlanBrief";

/**
 * "Plan a Reel": an Instagram-style Reel Studio (compose the real Reel, live)
 * that produces a pre-production brief of the responsible-AI levers to build in
 * before the Reel is made — personalized to the Reel the marketer just composed.
 */
export function PlanFlow({
  answers,
  onAnswer,
  onExit,
  onCheckInstead,
  onRestart,
}: {
  answers: ReelAnswers;
  onAnswer: (qid: string, value: string | string[]) => void;
  onExit: () => void;
  onCheckInstead: () => void;
  onRestart: () => void;
}) {
  const [showBrief, setShowBrief] = useState(
    () => planContextComplete(answers) && planReadiness(answers).canGenerate,
  );

  const brief = useMemo(() => buildPlanBrief(answers), [answers]);

  if (showBrief) {
    return (
      <PlanBrief
        data={brief}
        answers={answers}
        onRestart={() => {
          onRestart();
          setShowBrief(false);
        }}
        onEdit={() => setShowBrief(false)}
        onCheckInstead={onCheckInstead}
        onExit={onExit}
      />
    );
  }

  return (
    <PlanComposer
      answers={answers}
      onAnswer={onAnswer}
      onExit={onExit}
      onGenerate={() => setShowBrief(true)}
      onCheckInstead={onCheckInstead}
    />
  );
}
