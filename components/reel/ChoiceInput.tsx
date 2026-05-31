"use client";

import type { ReelOption } from "@/data/reelCheck";

/**
 * Big, tappable choice cards. Single-select advances; multi-select toggles.
 * Replaces the 1–5 Likert grid with plain-language options so the flow reads
 * like a diagnostic conversation rather than a survey.
 */
export function ChoiceInput({
  options,
  value,
  multi = false,
  onChange,
}: {
  options: ReelOption[];
  value: string | string[] | undefined;
  multi?: boolean;
  onChange: (next: string | string[]) => void;
}) {
  const selected = (id: string): boolean =>
    multi ? Array.isArray(value) && value.includes(id) : value === id;

  const handle = (id: string) => {
    if (!multi) {
      onChange(id);
      return;
    }
    const current = Array.isArray(value) ? value : [];
    onChange(
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    );
  };

  return (
    <ul className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const isSel = selected(opt.id);
        return (
          <li key={opt.id}>
            <button
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={isSel}
              onClick={() => handle(opt.id)}
              className={[
                "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition sm:px-5 sm:py-4",
                isSel
                  ? "border-[var(--color-syrah)] bg-[var(--color-syrah)] text-white shadow-[0_10px_30px_-14px_rgba(110,41,52,0.7)]"
                  : "border-[var(--color-skyway)]/50 bg-white text-[var(--color-ink)] hover:border-[var(--color-syrah)]/60 hover:bg-[var(--color-paper-soft)]",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={[
                  "grid size-5 shrink-0 place-items-center border transition",
                  multi ? "rounded-md" : "rounded-full",
                  isSel
                    ? "border-white bg-white/20"
                    : "border-[var(--color-skyway)] group-hover:border-[var(--color-syrah)]/60",
                ].join(" ")}
              >
                {isSel && (
                  <span
                    className={
                      multi
                        ? "text-[12px] leading-none text-white"
                        : "size-2 rounded-full bg-white"
                    }
                  >
                    {multi ? "✓" : ""}
                  </span>
                )}
              </span>
              <span className="text-[14px] leading-snug sm:text-[15px]">
                {opt.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
