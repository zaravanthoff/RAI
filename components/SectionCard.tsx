"use client";

import {
  dimensionsBySection,
  questionsByDimension,
  type Section,
} from "@/data/assessment";
import type { Answer, Answers } from "@/lib/scoring";
import { LikertInput } from "./LikertInput";

const ACCENT_BG: Record<Section["accent"], string> = {
  "tawny-port": "bg-[var(--color-tawny-port)]",
  "rythmic-red": "bg-[var(--color-rythmic-red)]",
  toffee: "bg-[var(--color-toffee)]",
};

const ACCENT_RING: Record<Section["accent"], string> = {
  "tawny-port": "ring-[var(--color-tawny-port)]/30",
  "rythmic-red": "ring-[var(--color-rythmic-red)]/30",
  toffee: "ring-[var(--color-toffee)]/30",
};

export function SectionCard({
  section,
  answers,
  onAnswer,
}: {
  section: Section;
  answers: Answers;
  onAnswer: (questionId: string, value: Answer) => void;
}) {
  const dims = dimensionsBySection[section.id];

  return (
    <article className="animate-rise overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(31,53,81,0.25)] ring-1 ring-black/5">
      <header className="relative isolate overflow-hidden bg-[var(--color-blue-opal)] px-6 py-7 text-white sm:px-9 sm:py-9">
        <div
          aria-hidden
          className={`absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-70 blur-3xl ${ACCENT_BG[section.accent]}`}
        />
        <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-skyway)]">
          <span
            className={`grid size-7 place-items-center rounded-full ring-1 ${ACCENT_RING[section.accent]} ${ACCENT_BG[section.accent]} font-display text-[13px] text-white`}
          >
            {section.number}
          </span>
          Section {section.number} of 3 · RAI capability: {section.capability}
        </div>
        <h2 className="font-display mt-3 text-3xl leading-tight text-balance sm:text-4xl">
          {section.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-skyway-soft)] sm:text-base">
          {section.subtitle}
        </p>
      </header>

      <div className="divide-y divide-[var(--color-skyway)]/30 px-2 sm:px-3">
        {dims.map((dim) => {
          const qs = questionsByDimension[dim.id];
          return (
            <section key={dim.id} className="px-4 py-7 sm:px-6 sm:py-9">
              <header className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-xl text-[var(--color-syrah-deep)] sm:text-2xl">
                  {dim.label}
                </h3>
                {dim.critical && (
                  <span className="rounded-full bg-[var(--color-amberlight)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-syrah-deep)]">
                    Critical
                  </span>
                )}
                <span className="ml-auto text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]/60">
                  {dim.source === "literature" ? "RAI capability" : "Emergent moderator"}
                </span>
              </header>
              <p className="mb-6 max-w-2xl text-sm text-[var(--color-ink-soft)] sm:text-[15px]">
                {dim.blurb}
              </p>
              <ul className="flex flex-col gap-6">
                {qs.map((q, idx) => (
                  <li key={q.id}>
                    <p className="mb-3 text-[15px] leading-snug text-[var(--color-ink)] sm:text-base">
                      <span className="mr-2 font-display text-[var(--color-syrah)]/70">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {q.text}
                    </p>
                    <LikertInput
                      name={q.id}
                      value={answers[q.id] ?? null}
                      onChange={(v) => onAnswer(q.id, v)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
