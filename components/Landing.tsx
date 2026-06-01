"use client";

import type { Mode } from "@/lib/storage";

const STAGES = [
  { n: 1, when: "Before you make it" },
  { n: 2, when: "After you make it" },
  { n: 3, when: "Zoom out" },
];

export function Landing({
  onSelect,
  onResearch,
  reelInProgress,
  teamInProgress,
  planInProgress,
  onClear,
}: {
  onSelect: (mode: Mode) => void;
  onResearch: () => void;
  reelInProgress: boolean;
  teamInProgress: boolean;
  planInProgress: boolean;
  onClear: () => void;
}) {
  const hasProgress = reelInProgress || teamInProgress || planInProgress;

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--color-paper-soft)]">
      {/* soft palette accent, kept light + clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(48% 55% at 82% 8%, rgba(221,181,141,0.30) 0%, rgba(247,240,230,0) 60%), radial-gradient(42% 50% at 6% 96%, rgba(165,178,199,0.28) 0%, rgba(247,240,230,0) 62%)",
        }}
      />

      {/* center */}
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16 sm:px-10">
        <div className="stagger max-w-3xl">
          <p className="eyebrow text-[var(--color-syrah)]">
            Responsible AI · Instagram Reels · Gen Z
          </p>
          <h1 className="font-display mt-5 text-balance text-[2.1rem] leading-[1.06] text-[var(--color-syrah-deep)] sm:text-5xl lg:text-[3.4rem]">
            How to use AI responsibly in Instagram Reels advertising without
            losing Gen&nbsp;Z&apos;s trust.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base text-[var(--color-ink-soft)] sm:text-lg">
            The trust problem isn&apos;t the AI. It&apos;s the choices you make
            around it. Three tools follow one Reel through its life. Pick where
            you are.
          </p>
        </div>

        {/* the three tools, as a before → after → zoom-out journey */}
        <div className="mt-10 sm:mt-12">
          {/* connected timeline rail (desktop) — columns align with the cards */}
          <div className="mb-4 hidden grid-cols-3 gap-4 sm:grid">
            {STAGES.map((s, i) => (
              <div key={s.n} className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-syrah)] text-[13px] font-semibold text-white">
                  {s.n}
                </span>
                <span className="eyebrow whitespace-nowrap text-[var(--color-syrah)]/80">
                  {s.when}
                </span>
                {i < STAGES.length - 1 && (
                  <span className="h-px flex-1 bg-[var(--color-skyway)]/60" />
                )}
              </div>
            ))}
          </div>

          {/* tool cards */}
          <div className="stagger grid gap-4 sm:grid-cols-3">
            <ToolCard
              n={1}
              tone="primary"
              when="Before you make it"
              title="Plan a Reel"
              body="Compose the Reel you're about to make — describe the video, caption, brand and hashtags — and watch it build live. Get a responsible-AI brief tailored to that exact Reel."
              cta={planInProgress ? "Resume in the studio" : "Open the studio"}
              onClick={() => onSelect("plan")}
            />
            <ToolCard
              n={2}
              tone="white"
              when="After you make it"
              title="Check a Reel"
              body="Walk one AI-assisted Reel through a short, adaptive check. Get a clear verdict and a fix-it list before it goes live."
              cta={reelInProgress ? "Resume the check" : "Start a check"}
              onClick={() => onSelect("reel")}
            />
            <ToolCard
              n={3}
              tone="white"
              when="Zoom out"
              title="Assess our team"
              body="Rate how your team works with GAI in Reels across the study's dimensions. A readiness score for a workshop debrief."
              cta={teamInProgress ? "Resume the assessment" : "Assess our team"}
              onClick={() => onSelect("team")}
            />
          </div>

          {/* research — quiet 'learn' row, divided off from the tools */}
          <button
            type="button"
            onClick={onResearch}
            className="group mt-7 flex w-full flex-col items-start gap-4 border-t border-[var(--color-skyway)]/40 pt-6 text-left sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="max-w-xl">
              <span className="eyebrow block text-[var(--color-syrah)]/60">
                Understand the thinking
              </span>
              <span className="mt-1 block text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                The research behind the tool: the conceptual model, the three trust
                relationships, and what the interviews found.
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-syrah)]/30 px-5 py-2.5 text-sm font-medium text-[var(--color-syrah)] transition group-hover:border-[var(--color-syrah)] group-hover:bg-white">
              Read the research
              <span
                aria-hidden
                className="transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </button>
        </div>
      </section>

      {/* footer */}
      <footer className="reveal delay-3 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 pb-7 text-[var(--color-ink-soft)]/60 sm:px-10">
        <p className="text-sm">
          Grounded in 11 interviews with marketing professionals · about 3
          minutes.
        </p>
        {hasProgress && (
          <button
            type="button"
            onClick={onClear}
            className="eyebrow text-[var(--color-ink-soft)]/55 underline-offset-4 transition hover:text-[var(--color-syrah)] hover:underline"
          >
            Clear saved progress
          </button>
        )}
      </footer>
    </main>
  );
}

type Tone = "primary" | "white";

function ToolCard({
  n,
  tone,
  when,
  title,
  body,
  cta,
  onClick,
}: {
  n: number;
  tone: Tone;
  when: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  const primary = tone === "primary";
  const surface = primary
    ? "bg-[var(--color-blue-opal)] text-white shadow-[0_30px_80px_-50px_rgba(31,53,81,0.55)] hover:shadow-[0_40px_90px_-45px_rgba(31,53,81,0.6)]"
    : "bg-white text-[var(--color-ink)] ring-1 ring-black/5 hover:ring-[var(--color-syrah)]/25";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`lift group flex flex-col rounded-3xl p-6 text-left sm:p-7 ${surface}`}
    >
      {/* stage marker — only on mobile; the desktop rail carries it otherwise */}
      <div className="flex items-center gap-2.5 sm:hidden">
        <span
          className={[
            "grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold",
            primary
              ? "bg-[var(--color-amberlight)] text-[var(--color-blue-opal-deep)]"
              : "bg-[var(--color-syrah)] text-white",
          ].join(" ")}
        >
          {n}
        </span>
        <span
          className={[
            "eyebrow",
            primary ? "text-[var(--color-amberlight)]" : "text-[var(--color-syrah)]/70",
          ].join(" ")}
        >
          {when}
        </span>
      </div>

      <h2
        className={[
          "font-display mt-3 text-2xl sm:mt-0 sm:text-3xl",
          primary ? "text-white" : "text-[var(--color-syrah-deep)]",
        ].join(" ")}
      >
        {title}
      </h2>
      <p
        className={[
          "mt-2.5 flex-1 text-sm leading-relaxed",
          primary ? "text-[var(--color-skyway-soft)]" : "text-[var(--color-ink-soft)]",
        ].join(" ")}
      >
        {body}
      </p>
      <span
        className={[
          "mt-5 inline-flex items-center gap-2 text-sm font-medium",
          primary ? "text-[var(--color-amberlight)]" : "text-[var(--color-syrah)]",
        ].join(" ")}
      >
        {cta}
        <span
          aria-hidden
          className="transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </button>
  );
}
