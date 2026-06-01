"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/data/assessment";
import type { ReelAnswers } from "@/data/reelCheck";
import { scoreAssessment, type Answer, type Answers } from "@/lib/scoring";
import { scoreReel } from "@/lib/reelScoring";
import { clearState, loadState, saveState, type Mode } from "@/lib/storage";
import { Landing } from "./Landing";
import { Research } from "./research/Research";
import { ResultsDashboard } from "./ResultsDashboard";
import { TeamFlow } from "./team/TeamFlow";
import { PlanFlow } from "./plan/PlanFlow";
import { ReelFlow } from "./reel/ReelFlow";
import { ReelResults } from "./reel/ReelResults";

type Stage =
  | "landing"
  | "research"
  | "team"
  | "team-results"
  | "reel"
  | "reel-results"
  | "plan";

const TOTAL_STEPS = sections.length;

export function AssessmentApp() {
  const [stage, setStage] = useState<Stage>("landing");
  const [step, setStep] = useState(0); // team: 0..TOTAL_STEPS-1
  const [answers, setAnswers] = useState<Answers>({});
  const [reelAnswers, setReelAnswers] = useState<ReelAnswers>({});
  const [planAnswers, setPlanAnswers] = useState<ReelAnswers>({});
  const [hydrated, setHydrated] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setAnswers(saved.answers ?? {});
      setReelAnswers(saved.reelAnswers ?? {});
      setPlanAnswers(saved.planAnswers ?? {});
      setStep(Math.min(Math.max(saved.step ?? 0, 0), TOTAL_STEPS - 1));
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveState({
      answers,
      reelAnswers,
      planAnswers,
      step,
      updatedAt: new Date().toISOString(),
    });
  }, [answers, reelAnswers, planAnswers, step, hydrated]);

  const teamInProgress = useMemo(
    () => Object.values(answers).some((v) => v !== null && v !== undefined),
    [answers],
  );
  const reelInProgress = useMemo(
    () => Object.keys(reelAnswers).length > 0,
    [reelAnswers],
  );
  const planInProgress = useMemo(
    () => Object.keys(planAnswers).length > 0,
    [planAnswers],
  );

  const scrollTop = () =>
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );

  const goTo = (s: Stage, stepIndex?: number) => {
    setStage(s);
    if (typeof stepIndex === "number") setStep(stepIndex);
    scrollTop();
  };

  const selectMode = (mode: Mode) => {
    if (mode === "reel") goTo("reel");
    else if (mode === "plan") goTo("plan");
    else goTo("team", teamInProgress ? step : 0);
  };

  const teamResult = useMemo(() => scoreAssessment(answers), [answers]);
  const reelResult = useMemo(() => scoreReel(reelAnswers), [reelAnswers]);

  // ── Landing ────────────────────────────────────────────────────
  if (stage === "landing") {
    return (
      <Landing
        onSelect={selectMode}
        onResearch={() => goTo("research")}
        reelInProgress={reelInProgress}
        teamInProgress={teamInProgress}
        planInProgress={planInProgress}
        onClear={() => {
          clearState();
          setAnswers({});
          setReelAnswers({});
          setPlanAnswers({});
          setStep(0);
        }}
      />
    );
  }

  // ── Research ───────────────────────────────────────────────────
  if (stage === "research") {
    return (
      <>
        <div ref={topRef} />
        <Research onBack={() => goTo("landing")} />
      </>
    );
  }

  // ── Reel checker ───────────────────────────────────────────────
  if (stage === "reel") {
    return (
      <>
        <div ref={topRef} />
        <ReelFlow
          answers={reelAnswers}
          onAnswer={(qid, value) =>
            setReelAnswers((prev) => ({ ...prev, [qid]: value }))
          }
          onComplete={() => goTo("reel-results")}
          onExit={() => goTo("landing")}
        />
      </>
    );
  }

  if (stage === "reel-results") {
    return (
      <main>
        <div ref={topRef} />
        <ReelResults
          result={reelResult}
          onRestart={() => {
            setReelAnswers({});
            goTo("reel");
          }}
          onTeamMode={() => goTo("team", 0)}
        />
      </main>
    );
  }

  // ── Plan a Reel (pre-production) ───────────────────────────────
  if (stage === "plan") {
    return (
      <>
        <div ref={topRef} />
        <PlanFlow
          answers={planAnswers}
          onAnswer={(qid, value) =>
            setPlanAnswers((prev) => ({ ...prev, [qid]: value }))
          }
          onRestart={() => setPlanAnswers({})}
          onCheckInstead={() => goTo("reel")}
          onExit={() => goTo("landing")}
        />
      </>
    );
  }

  // ── Team results ───────────────────────────────────────────────
  if (stage === "team-results") {
    return (
      <main>
        <div ref={topRef} />
        <ResultsDashboard
          result={teamResult}
          onRestart={() => {
            setAnswers({});
            setStep(0);
            goTo("landing");
          }}
        />
      </main>
    );
  }

  // ── Team assessment ────────────────────────────────────────────
  return (
    <>
      <div ref={topRef} />
      <TeamFlow
        answers={answers}
        onAnswer={(qid: string, value: Answer) =>
          setAnswers((prev) => ({ ...prev, [qid]: value }))
        }
        onComplete={() => goTo("team-results")}
        onExit={() => goTo("landing")}
      />
    </>
  );
}
