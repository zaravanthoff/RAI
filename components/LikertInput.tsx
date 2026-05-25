"use client";

import type { Answer, LikertValue } from "@/lib/scoring";

const SCALE: { value: LikertValue; label: string; help: string }[] = [
  { value: 1, label: "1", help: "Never" },
  { value: 2, label: "2", help: "Rarely" },
  { value: 3, label: "3", help: "Sometimes" },
  { value: 4, label: "4", help: "Often" },
  { value: 5, label: "5", help: "Always" },
];

export function LikertInput({
  value,
  onChange,
  name,
}: {
  value: Answer;
  onChange: (next: Answer) => void;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-1.5 sm:gap-2">
        {SCALE.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${opt.label} — ${opt.help}`}
              onClick={() => onChange(opt.value)}
              className={[
                "group flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 text-center transition sm:py-4",
                selected
                  ? "border-[var(--color-syrah)] bg-[var(--color-syrah)] text-white shadow-[0_6px_20px_-8px_rgba(110,41,52,0.6)]"
                  : "border-[var(--color-skyway)]/50 bg-white text-[var(--color-ink-soft)] hover:border-[var(--color-syrah)]/60 hover:text-[var(--color-syrah)]",
              ].join(" ")}
            >
              <span className="font-display text-xl leading-none sm:text-2xl">{opt.label}</span>
              <span
                className={[
                  "text-[10px] uppercase tracking-[0.12em] sm:text-[11px]",
                  selected ? "text-white/80" : "text-[var(--color-ink-soft)]/70",
                ].join(" ")}
              >
                {opt.help}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]/60">
        <span>Not in place</span>
        <button
          type="button"
          role="radio"
          aria-checked={value === "unsure"}
          onClick={() => onChange("unsure")}
          className={[
            "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition",
            value === "unsure"
              ? "border-[var(--color-blue-opal)] bg-[var(--color-blue-opal)] text-white"
              : "border-[var(--color-skyway)]/60 text-[var(--color-ink-soft)] hover:border-[var(--color-blue-opal)] hover:text-[var(--color-blue-opal)]",
          ].join(" ")}
          aria-label={`${name} — Not sure (excluded from score)`}
        >
          Not sure
        </button>
        <span>Established practice</span>
      </div>
    </div>
  );
}
