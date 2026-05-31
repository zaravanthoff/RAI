"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/data/assessment";
import type { ReelAnswers } from "@/data/reelCheck";
import {
  isAssessmentComplete,
  isSectionComplete,
  progressFraction,
  scoreAssessment,
  type Answer,
  type Answers,
} from "@/lib/scoring";
import { scoreReel } from "@/lib/reelScoring";
import { clearState, loadState, saveState, type Mode } from "@/lib/storage";
import { Landing } from "./Landing";
import { Research } from "./research/Research";
import { SectionCard } from "./SectionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsDashboard } from "./ResultsDashboard";
import { ReelFlow } from "./reel/ReelFlow";
import { ReelResults } from "./reel/ReelResults";

type Stage =
  | "landing"
  | "research"
  | "team"
  | "team-results"
  | "reel"
  | "reel-results";

const TOTAL_STEPS = sections.length;

export function AssessmentApp() {
  const [stage, setStage] = useState<Stage>("landing");
  const [step, setStep] = useState(0); // team: 0..TOTAL_STEPS-1
  const [answers, setAnswers] = useState<Answers>({});
  const [reelAnswers, setReelAnswers] = useState<ReelAnswers>({});
  const [hydrated, setHydrated] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setAnswers(saved.answers ?? {});
      setReelAnswers(saved.reelAnswers ?? {});
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
      step,
      updatedAt: new Date().toISOString(),
    });
  }, [answers, reelAnswers, step, hydrated]);

  const teamInProgress = useMemo(
    () => Object.values(answers).some((v) => v !== null && v !== undefined),
    [answers],
  );
  const reelInProgress = useMemo(
    () => Object.keys(reelAnswers).length > 0,
    [reelAnswers],
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
    else goTo("team", teamInProgress ? step : 0);
  };

  const currentSection = sections[step];
  const fraction = progressFraction(answers);
  const currentComplete = currentSection
    ? isSectionComplete(currentSection.id, answers)
    : false;
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
        onClear={() => {
          clearState();
          setAnswers({});
          setReelAnswers({});
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
    <main className="min-h-screen pb-24">
      <ProgressBar step={step} total={TOTAL_STEPS} fraction={fraction} />

      <div ref={topRef} />

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-8">
        <SectionCard
          section={currentSection}
          answers={answers}
          onAnswer={(qid: string, value: Answer) =>
            setAnswers((prev) => ({ ...prev, [qid]: value }))
          }
        />

        <nav className="no-print mt-8 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              if (step === 0) goTo("landing");
              else goTo("team", step - 1);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-skyway)] bg-white px-5 py-3 text-sm text-[var(--color-ink-soft)] transition hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
          >
            ← {step === 0 ? "Back to start" : `Section ${step}`}
          </button>

          <div className="flex flex-col items-end gap-2 sm:items-end">
            {!currentComplete && (
              <p className="text-xs text-[var(--color-ink-soft)]/70">
                Tip: every question needs an answer or a &quot;Not sure&quot;.
              </p>
            )}
            <button
              type="button"
              disabled={!currentComplete}
              onClick={() => {
                if (step === TOTAL_STEPS - 1) {
                  if (isAssessmentComplete(answers)) goTo("team-results");
                } else {
                  goTo("team", step + 1);
                }
              }}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition",
                currentComplete
                  ? "bg-[var(--color-syrah)] text-white hover:bg-[var(--color-syrah-deep)]"
                  : "cursor-not-allowed bg-[var(--color-skyway)]/60 text-white/70",
              ].join(" ")}
            >
              {step === TOTAL_STEPS - 1
                ? "See my results"
                : `Next: ${sections[step + 1].title}`}
              <span aria-hidden>→</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
