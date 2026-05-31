"use client";

import type { Stage, StageId, StageStatus } from "@/lib/reelStages";

const REL_DOT: Record<string, string> = {
  authenticity: "var(--color-tawny-port)",
  bias: "var(--color-rythmic-red)",
  ip: "var(--color-toffee)",
};

const STATUS_LABEL: Record<StageStatus, string> = {
  done: "Done",
  active: "Start",
  locked: "Locked",
  skipped: "Not relevant",
};

export function ReelHub({
  stages,
  allComplete,
  onSelectStage,
  onSeeVerdict,
  onExit,
}: {
  stages: Stage[];
  allComplete: boolean;
  onSelectStage: (id: StageId) => void;
  onSeeVerdict: () => void;
  onExit: () => void;
}) {
  const settled = stages.filter(
    (s) => s.status === "done" || s.status === "skipped",
  ).length;

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--color-paper-soft)]">
      <header className="reveal mx-auto flex w-full max-w-2xl items-center justify-between px-6 pt-7 sm:px-8">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition hover:text-[var(--color-syrah)]"
        >
          ← Home
        </button>
        <span className="text-[13px] text-[var(--color-ink-soft)]/60">
          {settled} / {stages.length} steps
        </span>
      </header>

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-10 sm:px-8">
        <div className="reveal">
          <p className="eyebrow text-[var(--color-syrah)]">Check a Reel</p>
          <h1 className="font-display mt-3 text-balance text-[2rem] leading-[1.05] text-[var(--color-syrah-deep)] sm:text-4xl">
            Work through each step. Each one unlocks the next.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-[var(--color-ink-soft)] sm:text-base">
            Set the scene first — your answers decide which checks actually apply
            to this Reel, so you only do what's relevant.
          </p>
        </div>

        <ol className="stagger mt-8 flex flex-col gap-3">
          {stages.map((stage, i) => (
            <StageRow
              key={stage.id}
              stage={stage}
              index={i + 1}
              onClick={() => onSelectStage(stage.id)}
            />
          ))}
        </ol>

        <div className="reveal delay-3 mt-8">
          <button
            type="button"
            disabled={!allComplete}
            onClick={onSeeVerdict}
            className={[
              "lift inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium sm:w-auto",
              allComplete
                ? "bg-[var(--color-syrah)] text-white hover:bg-[var(--color-syrah-deep)]"
                : "cursor-not-allowed bg-[var(--color-skyway)]/40 text-[var(--color-ink-soft)]/60",
            ].join(" ")}
          >
            {allComplete ? "See your verdict" : "Finish the steps to unlock your verdict"}
            {allComplete && <span aria-hidden>→</span>}
          </button>
        </div>
      </section>
    </main>
  );
}

function StageRow({
  stage,
  index,
  onClick,
}: {
  stage: Stage;
  index: number;
  onClick: () => void;
}) {
  const clickable = stage.status === "active" || stage.status === "done";
  const dot = stage.id !== "scene" ? REL_DOT[stage.id] : null;

  const indicator =
    stage.status === "done" ? (
      <span className="grid size-8 place-items-center rounded-full bg-[var(--color-syrah)] text-sm font-semibold text-white">
        ✓
      </span>
    ) : stage.status === "active" ? (
      <span className="grid size-8 place-items-center rounded-full bg-[var(--color-amberlight)] font-display text-sm text-[var(--color-syrah-deep)]">
        {index}
      </span>
    ) : stage.status === "skipped" ? (
      <span className="grid size-8 place-items-center rounded-full bg-[var(--color-skyway)]/30 text-sm text-[var(--color-ink-soft)]/50">
        –
      </span>
    ) : (
      <span className="grid size-8 place-items-center rounded-full bg-[var(--color-skyway)]/25 text-[var(--color-ink-soft)]/45">
        {/* lock */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );

  return (
    <li>
      <button
        type="button"
        onClick={clickable ? onClick : undefined}
        disabled={!clickable}
        aria-disabled={!clickable}
        className={[
          "flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left sm:px-5",
          clickable
            ? "lift cursor-pointer border-black/5 bg-white shadow-[0_24px_60px_-50px_rgba(31,53,81,0.4)] hover:border-[var(--color-syrah)]/25"
            : "cursor-not-allowed border-transparent bg-white/40",
          stage.status === "active"
            ? "ring-1 ring-[var(--color-amberlight)]"
            : "",
        ].join(" ")}
      >
        {indicator}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            {dot && (
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: dot }}
              />
            )}
            <span
              className={[
                "font-display text-lg",
                stage.status === "locked" || stage.status === "skipped"
                  ? "text-[var(--color-ink-soft)]/55"
                  : "text-[var(--color-syrah-deep)]",
              ].join(" ")}
            >
              {stage.title}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-[var(--color-ink-soft)]/65">
            {stage.status === "skipped"
              ? "No AI-trust risk to check for this Reel."
              : stage.status === "locked"
                ? "Unlocks once the previous step is done."
                : stage.total > 0
                  ? `${stage.answered} of ${stage.total} answered`
                  : stage.blurb}
          </span>
        </span>
        <span
          className={[
            "eyebrow shrink-0 rounded-full px-3 py-1",
            stage.status === "done"
              ? "bg-[var(--color-syrah)]/8 text-[var(--color-syrah)]"
              : stage.status === "active"
                ? "bg-[var(--color-amberlight)]/30 text-[var(--color-syrah-deep)]"
                : "text-[var(--color-ink-soft)]/40",
          ].join(" ")}
        >
          {stage.status === "active" && stage.answered > 0
            ? "Continue"
            : STATUS_LABEL[stage.status]}
        </span>
      </button>
    </li>
  );
}
