"use client";

import { useEffect, useRef, useState } from "react";
import type { ReelAnswers } from "@/data/reelCheck";
import type { Stage } from "@/lib/reelStages";
import { ChoiceInput } from "./ChoiceInput";

const REL_DOT: Record<string, string> = {
  authenticity: "var(--color-tawny-port)",
  bias: "var(--color-rythmic-red)",
  ip: "var(--color-toffee)",
};

export function ReelStage({
  stage,
  answers,
  onAnswer,
  onBack,
  onFinish,
}: {
  stage: Stage;
  answers: ReelAnswers;
  onAnswer: (qid: string, value: string | string[]) => void;
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

  const value = answers[q.id];
  const answered = Array.isArray(value) ? value.length > 0 : value != null;
  const isLast = clamped === stage.questions.length - 1;
  const dot = stage.id !== "scene" ? REL_DOT[stage.id] : null;

  const handleAnswer = (next: string | string[]) => {
    onAnswer(q.id, next);
    if (!q.multi && !isLast) {
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
          {dot && (
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: dot }}
            />
          )}
          <span className="font-medium text-[var(--color-syrah-deep)]">
            {stage.title}
          </span>
          <span className="text-[var(--color-ink-soft)]/45">
            {clamped + 1} / {stage.questions.length}
          </span>
        </span>
      </header>

      {/* question */}
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-10 sm:px-8">
        <div ref={cardRef} key={q.id} className="reveal">
          {q.critical && (
            <span className="eyebrow inline-block rounded-full bg-[var(--color-amberlight)] px-2.5 py-1 text-[var(--color-syrah-deep)]">
              Critical lever
            </span>
          )}
          <h1
            className={[
              "font-display text-balance text-[var(--color-syrah-deep)]",
              q.critical ? "mt-3" : "",
              "text-[1.7rem] leading-[1.1] sm:text-4xl",
            ].join(" ")}
          >
            {q.prompt}
          </h1>
          {q.help && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {q.help}
            </p>
          )}
          {q.multi && (
            <p className="eyebrow mt-3 text-[var(--color-syrah)]/70">
              Select all that apply
            </p>
          )}

          <div className="mt-7">
            <ChoiceInput
              options={q.options}
              value={value}
              multi={q.multi}
              onChange={handleAnswer}
            />
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
