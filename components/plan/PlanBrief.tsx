"use client";

import { useState } from "react";
import type { ReelAnswers } from "@/data/reelCheck";
import type { PlanBriefData, PlanGroup } from "@/lib/planBrief";
import { PLAN_KEYS, brandTypeOf, planStr } from "@/lib/planComposer";

const ACCENT: Record<PlanGroup["accent"], string> = {
  "tawny-port": "var(--color-tawny-port)",
  "rythmic-red": "var(--color-rythmic-red)",
  toffee: "var(--color-toffee)",
};

const STANCE_BG: Record<string, string> = {
  watch: "var(--color-rythmic-red)",
  mixed: "var(--color-toffee)",
  ok: "var(--color-blue-opal)",
};

/** Split an action paragraph into a punchy first-line action and the rest. */
function splitAction(text: string): { head: string; rest: string } {
  const parts = text.split(/(?<=[.?!])\s+/);
  return { head: parts[0] ?? text, rest: parts.slice(1).join(" ").trim() };
}

export function PlanBrief({
  data,
  answers,
  onRestart,
  onEdit,
  onCheckInstead,
  onExit,
}: {
  data: PlanBriefData;
  answers: ReelAnswers;
  onRestart: () => void;
  onEdit: () => void;
  onCheckInstead: () => void;
  onExit: () => void;
}) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Number the levers in a single running sequence across the groups.
  let counter = 0;
  const numbered = data.groups.map((g) => ({
    ...g,
    levers: g.levers.map((l) => ({ ...l, n: ++counter })),
  }));

  const doneCount = done.size;
  const pct = data.totalLevers ? (doneCount / data.totalLevers) * 100 : 0;

  // Personalization from the studio
  const handle = (planStr(answers, PLAN_KEYS.handle).trim() || "yourbrand").replace(/^@/, "");
  const brand = brandTypeOf(answers);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
      <div className="no-print flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition hover:text-[var(--color-syrah)]"
        >
          ← Home
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition hover:text-[var(--color-syrah)]"
        >
          ← Back to studio
        </button>
      </div>

      {/* header — centered intro + progress + funnel */}
      <section className="reveal mx-auto mt-8 max-w-2xl space-y-5 text-center">
        <div>
          <p className="eyebrow text-[var(--color-syrah)]">@{handle}&apos;s Reel plan</p>
          <h1 className="font-display mt-2 text-balance text-3xl leading-[1.06] text-[var(--color-syrah-deep)] sm:text-[2.5rem]">
            Build these in before you publish
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            {data.totalLevers} {data.totalLevers === 1 ? "step" : "steps"} apply to{" "}
            {brand ? `your ${brand.label.toLowerCase()} Reel` : "this Reel"}. Tick each one off as
            you bake it into the brief.
          </p>
        </div>

        {/* progress tracker */}
        <div className="rounded-2xl bg-white p-4 text-left ring-1 ring-black/5 sm:px-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-display text-[var(--color-syrah-deep)]">
              {doneCount} of {data.totalLevers} done
            </span>
            {doneCount === data.totalLevers && data.totalLevers > 0 && (
              <span className="eyebrow text-[var(--color-blue-opal)]">Brief complete ✓</span>
            )}
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-skyway)]/25">
            <div
              className="h-full rounded-full bg-[var(--color-syrah)] transition-[width] duration-500 [transition-timing-function:var(--ease-out-expo)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* funnel stance */}
        {data.funnelStance && (
          <div
            className="rounded-2xl px-5 py-4 text-left text-white"
            style={{ background: STANCE_BG[data.funnelStance.tone] }}
          >
            <p className="eyebrow text-white/70">Funnel stance</p>
            <p className="mt-1 text-[14.5px] leading-relaxed">{data.funnelStance.line}</p>
          </div>
        )}
      </section>

      {/* checklist — three clean columns, one per relationship category */}
      <div className="reveal delay-2 mx-auto mt-10 grid max-w-5xl items-start gap-x-7 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {numbered.map((group) => (
          <section key={group.id}>
            <div
              className="mb-4 flex items-center gap-2 border-b pb-2.5"
              style={{ borderColor: ACCENT[group.accent] }}
            >
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ background: ACCENT[group.accent] }}
              />
              <h2 className="font-display text-[1.05rem] text-[var(--color-syrah-deep)]">
                {group.title}
              </h2>
              <span className="ml-auto text-[12px] text-[var(--color-ink-soft)]/55">
                {group.levers.length} {group.levers.length === 1 ? "step" : "steps"}
              </span>
            </div>
            <ul className="space-y-3">
              {group.levers.map((lever) => {
                const id = `${group.id}-${lever.n}`;
                const isDone = done.has(id);
                const { head, rest } = splitAction(lever.action);
                return (
                  <li
                    key={id}
                    className="rounded-2xl bg-white p-4 ring-1 ring-black/5 transition"
                  >
                    <div className="flex items-start gap-3">
                      {/* checkbox */}
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isDone}
                        aria-label={`Mark "${lever.dimensionLabel}" done`}
                        onClick={() => toggle(id)}
                        className={[
                          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 text-sm font-bold transition",
                          isDone
                            ? "border-[var(--color-syrah)] bg-[var(--color-syrah)] text-white"
                            : "border-[var(--color-skyway)] text-transparent hover:border-[var(--color-syrah)]",
                        ].join(" ")}
                      >
                        ✓
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-[13px] text-[var(--color-ink-soft)]/45">
                            {String(lever.n).padStart(2, "0")}
                          </span>
                          <span className="font-display text-[var(--color-syrah-deep)]">
                            {lever.dimensionLabel}
                          </span>
                        </div>

                        {/* the action — the clear next step */}
                        <p
                          className={[
                            "mt-1 text-[14px] leading-snug transition",
                            isDone
                              ? "text-[var(--color-ink-soft)]/45 line-through"
                              : "text-[var(--color-ink-soft)]",
                          ].join(" ")}
                        >
                          {head}
                        </p>

                        {/* supporting detail, collapsed by default */}
                        {rest && (
                          <details className="group mt-2">
                            <summary className="inline-flex items-center gap-1 text-[12.5px] text-[var(--color-ink-soft)]/60 hover:text-[var(--color-syrah)]">
                              <span className="chev">›</span> How to do it
                            </summary>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-soft)]/85">
                              {rest}
                            </p>
                          </details>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* footer actions */}
      <footer className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="lift rounded-full border border-[var(--color-skyway)]/70 bg-white px-5 py-2.5 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
        >
          Print / PDF the brief
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="lift rounded-full border border-[var(--color-skyway)]/70 bg-white px-5 py-2.5 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
        >
          Plan another Reel
        </button>
        <button
          type="button"
          onClick={onCheckInstead}
          className="lift rounded-full bg-[var(--color-syrah)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-syrah-deep)]"
        >
          Made it? Check the Reel →
        </button>
      </footer>
    </main>
  );
}
