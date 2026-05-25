"use client";

import { Logo } from "./Logo";

export function Hero({ onStart, hasInProgress }: { onStart: () => void; hasInProgress: boolean }) {
  return (
    <section className="grain-overlay relative isolate overflow-hidden bg-[var(--color-blue-opal-deep)] text-[var(--color-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 0%, rgba(157,61,75,0.55) 0%, rgba(31,53,81,0) 60%), radial-gradient(50% 70% at 10% 100%, rgba(221,181,141,0.25) 0%, rgba(31,53,81,0) 65%)",
        }}
      />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-7 sm:px-8 sm:pt-9">
        <Logo className="text-[var(--color-paper)]" />
        <span className="hidden text-xs uppercase tracking-[0.18em] text-[var(--color-skyway)] sm:inline">
          Assessment instrument · v1
        </span>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <p className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-skyway)] backdrop-blur">
          For marketing teams · GAI in Instagram Reels · Gen Z
        </p>
        <h1 className="animate-rise-delay-1 font-display text-balance text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
          Is your team using Generative&nbsp;AI in Reels in a way Gen&nbsp;Z will still trust?
        </h1>
        <p className="animate-rise-delay-2 mt-6 max-w-2xl text-balance text-base text-[var(--color-skyway-soft)] sm:text-lg">
          The trust problem with GAI in Reels is not a property of the AI. It is a property of the
          practices a brand puts around it. This tool scores those practices against the moderators
          that emerged from the study — and tells you where to put your next move.
        </p>

        <div className="animate-rise-delay-3 mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-amberlight)] px-7 py-3.5 text-sm font-medium text-[var(--color-syrah-deep)] shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition hover:bg-[var(--color-amberlight-soft)] active:translate-y-px"
          >
            {hasInProgress ? "Resume assessment" : "Start the assessment"}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
          <span className="text-sm text-[var(--color-skyway)]">
            ~5 minutes · 22 questions · no sign-in
          </span>
        </div>

        <dl className="mt-16 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <dt className="font-display text-3xl text-[var(--color-amberlight)]">3</dt>
            <dd className="mt-1 text-sm text-[var(--color-skyway-soft)]">
              Sections, mirroring the study's sub-questions: authenticity, bias, IP.
            </dd>
          </div>
          <div>
            <dt className="font-display text-3xl text-[var(--color-amberlight)]">10</dt>
            <dd className="mt-1 text-sm text-[var(--color-skyway-soft)]">
              Dimensions — three RAI capabilities and seven emergent moderators.
            </dd>
          </div>
          <div>
            <dt className="font-display text-3xl text-[var(--color-amberlight)]">5</dt>
            <dd className="mt-1 text-sm text-[var(--color-skyway-soft)]">
              Critical-threshold moderators carry the strongest weight in your score.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
