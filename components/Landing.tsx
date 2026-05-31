"use client";

import type { Mode } from "@/lib/storage";

export function Landing({
  onSelect,
  onResearch,
  reelInProgress,
  teamInProgress,
  onClear,
}: {
  onSelect: (mode: Mode) => void;
  onResearch: () => void;
  reelInProgress: boolean;
  teamInProgress: boolean;
  onClear: () => void;
}) {
  const hasProgress = reelInProgress || teamInProgress;

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
            How to use AI responsibly in Instagram Reels advertising to maintain
            Gen&nbsp;Z brand trust.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base text-[var(--color-ink-soft)] sm:text-lg">
            The trust problem isn&apos;t the AI. It&apos;s the choices you make
            around it. Pick how you want to start.
          </p>
        </div>

        {/* mode choices */}
        <div className="stagger mt-10 grid max-w-5xl gap-4 sm:mt-12 sm:grid-cols-3">
          <ModeCard
            tone="primary"
            kicker="Diagnose one piece of content"
            title="Check a Reel"
            body="Walk one AI-assisted Reel through a short, adaptive check. Get a clear verdict and a fix-it list before it goes live."
            cta={reelInProgress ? "Resume" : "Start a check"}
            onClick={() => onSelect("reel")}
          />
          <ModeCard
            tone="white"
            kicker="Step back to the bigger picture"
            title="Assess our team"
            body="Rate how your team works with GAI in Reels across the study's dimensions. A readiness score for a workshop debrief."
            cta={teamInProgress ? "Resume" : "Assess our team"}
            onClick={() => onSelect("team")}
          />
          <ModeCard
            tone="muted"
            kicker="Understand the thinking"
            title="The research"
            body="See the study behind the tool: the conceptual model, the three trust relationships, and what the interviews found."
            cta="Read about the research"
            onClick={onResearch}
          />
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

type Tone = "primary" | "white" | "muted";

function ModeCard({
  tone = "white",
  kicker,
  title,
  body,
  cta,
  onClick,
}: {
  tone?: Tone;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  const primary = tone === "primary";
  const surface =
    tone === "primary"
      ? "bg-[var(--color-blue-opal)] text-white shadow-[0_30px_80px_-50px_rgba(31,53,81,0.55)] hover:shadow-[0_40px_90px_-45px_rgba(31,53,81,0.6)]"
      : tone === "muted"
        ? "bg-[var(--color-paper)] text-[var(--color-ink)] ring-1 ring-[var(--color-skyway)]/40 hover:ring-[var(--color-syrah)]/25"
        : "bg-white text-[var(--color-ink)] ring-1 ring-black/5 hover:ring-[var(--color-syrah)]/25";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`lift group flex flex-col rounded-3xl p-6 text-left sm:p-7 ${surface}`}
    >
      <span
        className={[
          "eyebrow",
          primary ? "text-[var(--color-amberlight)]" : "text-[var(--color-syrah)]/70",
        ].join(" ")}
      >
        {kicker}
      </span>
      <h2
        className={[
          "font-display mt-2 text-2xl sm:text-3xl",
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
