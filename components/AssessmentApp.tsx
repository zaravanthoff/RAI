"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/data/assessment";
import {
  isAssessmentComplete,
  isSectionComplete,
  progressFraction,
  scoreAssessment,
  type Answer,
  type Answers,
} from "@/lib/scoring";
import { clearState, loadState, saveState } from "@/lib/storage";
import { Hero } from "./Hero";
import { SectionCard } from "./SectionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsDashboard } from "./ResultsDashboard";

type Stage = "landing" | "assessment" | "results";

const TOTAL_STEPS = sections.length;

export function AssessmentApp() {
  const [stage, setStage] = useState<Stage>("landing");
  const [step, setStep] = useState(0); // 0..TOTAL_STEPS-1
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const sectionTopRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setAnswers(saved.answers ?? {});
      setStep(Math.min(Math.max(saved.step ?? 0, 0), TOTAL_STEPS - 1));
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveState({ answers, step, updatedAt: new Date().toISOString() });
  }, [answers, step, hydrated]);

  const hasInProgress = useMemo(
    () => Object.values(answers).some((v) => v !== null && v !== undefined),
    [answers],
  );

  const handleAnswer = (qid: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const goTo = (s: Stage, stepIndex?: number) => {
    setStage(s);
    if (typeof stepIndex === "number") setStep(stepIndex);
    requestAnimationFrame(() => {
      sectionTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const currentSection = sections[step];
  const fraction = progressFraction(answers);
  const currentComplete = currentSection
    ? isSectionComplete(currentSection.id, answers)
    : false;
  const result = useMemo(() => scoreAssessment(answers), [answers]);

  if (stage === "landing") {
    return (
      <main>
        <Hero
          hasInProgress={hasInProgress}
          onStart={() => goTo("assessment", hasInProgress ? step : 0)}
        />
        <StudyExplainer />
        {hasInProgress && (
          <div className="mx-auto max-w-3xl px-5 pb-16 text-center sm:px-8">
            <button
              type="button"
              onClick={() => {
                clearState();
                setAnswers({});
                setStep(0);
              }}
              className="text-xs uppercase tracking-[0.16em] text-[var(--color-ink-soft)]/60 underline-offset-4 hover:text-[var(--color-syrah)] hover:underline"
            >
              Or start over with a clean assessment
            </button>
          </div>
        )}
      </main>
    );
  }

  if (stage === "results") {
    return (
      <main>
        <ResultsDashboard
          result={result}
          onRestart={() => {
            clearState();
            setAnswers({});
            setStep(0);
            goTo("landing");
          }}
        />
      </main>
    );
  }

  // assessment stage
  return (
    <main className="min-h-screen pb-24">
      <ProgressBar step={step} total={TOTAL_STEPS} fraction={fraction} />

      <div ref={sectionTopRef} />

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-8">
        <SectionCard
          section={currentSection}
          answers={answers}
          onAnswer={handleAnswer}
        />

        <nav className="no-print mt-8 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              if (step === 0) goTo("landing");
              else goTo("assessment", step - 1);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-skyway)] bg-white px-5 py-3 text-sm text-[var(--color-ink-soft)] transition hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
          >
            ← {step === 0 ? "Back to intro" : `Section ${step}`}
          </button>

          <div className="flex flex-col items-end gap-2 sm:items-end">
            {!currentComplete && (
              <p className="text-xs text-[var(--color-ink-soft)]/70">
                Tip: every question needs an answer or a "Not sure".
              </p>
            )}
            <button
              type="button"
              disabled={!currentComplete}
              onClick={() => {
                if (step === TOTAL_STEPS - 1) {
                  if (isAssessmentComplete(answers)) goTo("results");
                } else {
                  goTo("assessment", step + 1);
                }
              }}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition",
                currentComplete
                  ? "bg-[var(--color-syrah)] text-white hover:bg-[var(--color-syrah-deep)]"
                  : "cursor-not-allowed bg-[var(--color-skyway)]/60 text-white/70",
              ].join(" ")}
            >
              {step === TOTAL_STEPS - 1 ? "See my results" : `Next: ${sections[step + 1].title}`}
              <span aria-hidden>→</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}

function StudyExplainer() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr,1.4fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-syrah)]">
            Why this exists
          </p>
          <h2 className="font-display mt-3 text-3xl text-balance text-[var(--color-syrah-deep)] sm:text-4xl">
            The trust problem is not in the AI. It's in the practice around it.
          </h2>
        </div>
        <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-ink-soft)] sm:text-base">
          <p>
            Across all three sub-questions in the underlying study, the same pattern emerged:
            the literature located the trust problem in a property of the AI — autonomy,
            nonbiasedness, crediting — while the data located it in the practices that brands
            put around the AI.
          </p>
          <p>
            This instrument operationalises that finding. It scores your team against the
            three RAI capabilities from the literature <em>and</em> the seven moderators that
            emerged from the interviews. Five of those reached the study's critical
            threshold — they are weighted more heavily here.
          </p>
        </div>
      </div>

      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {sections.map((s) => (
          <li
            key={s.id}
            className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_-50px_rgba(31,53,81,0.25)] ring-1 ring-black/5"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]/60">
              SQ {s.number} · {s.capability}
            </p>
            <h3 className="font-display mt-2 text-2xl text-[var(--color-syrah-deep)]">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{s.subtitle}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
