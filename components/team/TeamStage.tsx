"use client";

import { useEffect, useRef, useState } from "react";
import { dimensions, type Section } from "@/data/assessment";
import type { Answer, Answers } from "@/lib/scoring";
import type { TeamStage as TeamStageType } from "@/lib/teamStages";
import { LikertInput } from "../LikertInput";

const ACCENT_DOT: Record<Section["accent"], string> = {
  "tawny-port": "var(--color-tawny-port)",
  "rythmic-red": "var(--color-rythmic-red)",
  toffee: "var(--color-toffee)",
};

const dimById = new Map(dimensions.map((d) => [d.id, d]));

export function TeamStage({
  stage,
  answers,
  onAnswer,
  onBack,
  onFinish,
}: {
  stage: TeamStageType;
  answers: Answers;
  onAnswer: (qid: string, value: Answer) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const clamped = Math.min(index, stage.questions.length - 1);
  const q = stage.questions[clamped];

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [clamped]);

  if (!q) return null;

  const dim = dimById.get(q.dimensionId);
  const value = answers[q.id] ?? null;
  const answered = value != null;
  const isLast = clamped === stage.questions.length - 1;
  const dot = ACCENT_DOT[stage.accent];

  const handleAnswer = (next: Answer) => {
    onAnswer(q.id, next);
    if (!isLast) {
      window.setTimeout(() => setIndex(clamped + 1), 220);
    }
  };

  const next = () => {
    if (isLast) onFinish();
    else setIndex(clamped + 1);
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--color-paper-soft)]">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 pt-7 sm:px-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition hover:text-[var(--color-syrah)]"
        >
          ← Overview
        </button>
        <span className="inline-flex items-center gap-2 text-[13px] text-[var(--color-ink-soft)]/70">
          <span
            className="inline-block size-1.5 rounded-full"
            style={{ background: dot }}
          />
          <span className="font-medium text-[var(--color-syrah-deep)]">
            {stage.title}
          </span>
          <span className="text-[var(--color-ink-soft)]/45">
            {clamped + 1} / {stage.questions.length}
          </span>
        </span>
      </header>

      {/* statement */}
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-10 sm:px-8">
        <div ref={cardRef} key={q.id} className="reveal">
          <div className="flex flex-wrap items-center gap-2">
            {dim && (
              <span className="eyebrow text-[var(--color-syrah)]/70">
                {dim.label}
              </span>
            )}
            {dim?.critical && (
              <span className="eyebrow rounded-full bg-[var(--color-amberlight)] px-2.5 py-1 text-[var(--color-syrah-deep)]">
                Critical
              </span>
            )}
          </div>
          <h1 className="font-display mt-3 text-balance text-[1.7rem] leading-[1.15] text-[var(--color-syrah-deep)] sm:text-[2rem]">
            {q.text}
          </h1>
          {q.help && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {q.help}
            </p>
          )}

          <div className="mt-7">
            <LikertInput name={q.id} value={value} onChange={handleAnswer} />
          </div>
        </div>
      </section>

      {/* footer nav */}
      <footer className="no-print mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 pb-9 sm:px-8">
        <button
          type="button"
          onClick={() => (clamped === 0 ? onBack() : setIndex(clamped - 1))}
          className="lift inline-flex items-center gap-2 rounded-full border border-[var(--color-skyway)]/70 bg-white px-5 py-3 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
        >
          ← {clamped === 0 ? "Overview" : "Back"}
        </button>
        <button
          type="button"
          disabled={!answered}
          onClick={next}
          className={[
            "lift inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium",
            answered
              ? "bg-[var(--color-syrah)] text-white hover:bg-[var(--color-syrah-deep)]"
              : "cursor-not-allowed bg-[var(--color-skyway)]/50 text-white/70",
          ].join(" ")}
        >
          {isLast ? `Finish ${stage.title.toLowerCase()}` : "Next"}
          <span aria-hidden>→</span>
        </button>
      </footer>
    </main>
  );
}
