"use client";

import { sections } from "@/data/assessment";
import type { AssessmentResult, DimensionScore } from "@/lib/scoring";
import { ResultsRadar } from "./ResultsRadar";

const fmt = (n: number | null) =>
  n === null ? "—" : Math.round(n).toString();

function bandColor(key?: string) {
  switch (key) {
    case "exposed":
      return "var(--color-rythmic-red)";
    case "developing":
      return "var(--color-toffee)";
    case "practising":
      return "var(--color-blue-opal)";
    case "embedded":
      return "var(--color-syrah)";
    default:
      return "var(--color-blue-opal)";
  }
}

export function ResultsDashboard({
  result,
  onRestart,
}: {
  result: AssessmentResult;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      {/* ── Headline ──────────────────────────────────────────────── */}
      <header className="animate-rise grid items-end gap-6 md:grid-cols-[1fr,auto]">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]/70">
            Your RAI-in-Reels readiness
          </p>
          <h1 className="font-display mt-2 text-4xl text-balance text-[var(--color-syrah-deep)] sm:text-5xl">
            {result.band?.label ?? "No score yet"}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[var(--color-ink-soft)] sm:text-lg">
            {result.band?.oneLiner ?? "Answer a few questions to see your score."}
          </p>
        </div>
        <div
          className="grain-overlay relative w-full overflow-hidden rounded-3xl px-7 py-6 text-white shadow-[0_20px_60px_-30px_rgba(31,53,81,0.6)] md:w-auto md:min-w-[220px]"
          style={{ background: bandColor(result.band?.key) }}
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">
            Overall score
          </p>
          <p className="font-display mt-2 flex items-baseline gap-1 text-5xl leading-none">
            {fmt(result.overall)}
            <span className="text-xl text-white/70">/100</span>
          </p>
        </div>
      </header>

      {/* ── Chart + recs ─────────────────────────────────────────── */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[1.05fr,1fr]">
        <div className="animate-rise-delay-1 rounded-3xl bg-white p-5 shadow-[0_30px_80px_-50px_rgba(31,53,81,0.35)] ring-1 ring-black/5 sm:p-7">
          <h2 className="font-display text-2xl text-[var(--color-syrah-deep)]">
            Across the 10 dimensions
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[var(--color-rythmic-red)]" />
              Critical-threshold moderators are marked.
            </span>
          </p>
          <ResultsRadar dimensions={result.dimensions} />
        </div>

        <div className="animate-rise-delay-2 flex flex-col gap-5">
          <RecommendationsCard items={result.topRecommendations} />
          <StrengthsCard items={result.topStrengths} />
        </div>
      </section>

      {/* ── Per section ──────────────────────────────────────────── */}
      <section className="animate-rise-delay-3 mt-12 grid gap-5 md:grid-cols-3">
        {result.sections.map((s) => {
          const meta = sections.find((x) => x.id === s.sectionId)!;
          return (
            <article
              key={s.sectionId}
              className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_-50px_rgba(31,53,81,0.25)] ring-1 ring-black/5"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]/60">
                Section {meta.number} · {meta.capability}
              </p>
              <h3 className="font-display mt-1 text-2xl text-[var(--color-syrah-deep)]">
                {meta.title}
              </h3>
              <p className="font-display mt-3 text-4xl text-[var(--color-syrah)]">
                {fmt(s.score)}
                <span className="ml-1 text-base text-[var(--color-ink-soft)]/60">/100</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {s.dimensions.map((d) => (
                  <li key={d.dimension.id} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-[var(--color-ink-soft)]">
                      {d.dimension.critical && (
                        <span className="inline-block size-1.5 shrink-0 rounded-full bg-[var(--color-rythmic-red)]" />
                      )}
                      <span className="truncate">{d.dimension.label}</span>
                    </span>
                    <span className="shrink-0 font-display text-[var(--color-syrah-deep)]">
                      {fmt(d.score)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      {/* ── Footer actions ───────────────────────────────────────── */}
      <footer className="no-print mt-14 flex flex-col items-center justify-between gap-4 rounded-3xl bg-[var(--color-blue-opal-deep)] px-6 py-7 text-white sm:flex-row sm:px-9">
        <p className="text-sm text-[var(--color-skyway-soft)]">
          Share this with your team, or print the report for a workshop debrief.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition hover:border-[var(--color-amberlight)] hover:text-[var(--color-amberlight)]"
          >
            Print / PDF
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-amberlight)] px-5 py-2.5 text-sm font-medium text-[var(--color-syrah-deep)] transition hover:bg-[var(--color-amberlight-soft)]"
          >
            Retake assessment
          </button>
        </div>
      </footer>
    </div>
  );
}

function RecommendationsCard({ items }: { items: DimensionScore[] }) {
  return (
    <div className="rounded-3xl bg-[var(--color-syrah-deep)] p-6 text-white shadow-[0_30px_80px_-50px_rgba(110,41,52,0.6)] sm:p-7">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-amberlight)]">
        Where to put your next move
      </p>
      <h2 className="font-display mt-1 text-2xl">Three recommendations</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-white/70">
          Answer at least one question to see recommendations.
        </p>
      ) : (
        <ol className="mt-5 space-y-5">
          {items.map((d) => (
            <li key={d.dimension.id}>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[var(--color-amberlight)]">
                  {Math.round(d.score ?? 0)}
                </span>
                <h3 className="font-display text-lg leading-tight">{d.dimension.label}</h3>
                {d.dimension.critical && (
                  <span className="rounded-full bg-[var(--color-amberlight)]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-amberlight)]">
                    Critical
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-white/85">
                {d.dimension.recommendation}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function StrengthsCard({ items }: { items: DimensionScore[] }) {
  return (
    <div className="rounded-3xl bg-[var(--color-amberlight-soft)] p-6 text-[var(--color-syrah-deep)] shadow-[0_30px_80px_-50px_rgba(221,181,141,0.7)] sm:p-7">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-syrah)]/70">
        What to protect
      </p>
      <h2 className="font-display mt-1 text-2xl">Top strengths</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm">No strengths to show yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((d) => (
            <li key={d.dimension.id} className="flex items-start gap-3 text-sm">
              <span className="font-display text-base text-[var(--color-syrah)]">
                {Math.round(d.score ?? 0)}
              </span>
              <div>
                <p className="font-medium leading-snug">{d.dimension.label}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--color-syrah-deep)]/85">
                  {d.dimension.strengthCopy}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
