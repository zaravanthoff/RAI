"use client";

import { sections } from "@/data/assessment";

export function ProgressBar({
  step,
  total,
  fraction,
}: {
  step: number; // 0 = section 1, 1 = section 2, 2 = section 3
  total: number;
  fraction: number; // 0..1
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--color-skyway)]/40 bg-[var(--color-paper-soft)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
          <span className="font-display text-base normal-case tracking-tight text-[var(--color-syrah-deep)]">
            Step {step + 1} of {total}
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-full bg-[var(--color-skyway)]/40">
          <div
            className="h-1.5 rounded-full bg-[var(--color-syrah)] transition-[width] duration-500"
            style={{ width: `${Math.max(0.04, fraction) * 100}%` }}
          />
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {sections.map((s, i) => (
            <span
              key={s.id}
              className={[
                "size-2 rounded-full transition",
                i <= step ? "bg-[var(--color-syrah)]" : "bg-[var(--color-skyway)]",
              ].join(" ")}
              aria-label={s.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
