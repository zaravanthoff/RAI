"use client";

import type { ReelResult, ScoredDiagnostic, Verdict } from "@/lib/reelScoring";
import type { RelationshipId } from "@/data/reelCheck";

const fmt = (n: number | null) => (n === null ? "–" : Math.round(n).toString());

/** A label with a dotted underline that reveals a plain-language tooltip on hover/focus. */
function InfoLabel({
  text,
  tip,
  className = "",
}: {
  text?: string;
  tip?: string;
  className?: string;
}) {
  if (!tip) return <span className={className}>{text}</span>;
  return (
    <span className="group/tip relative inline-flex">
      <span
        tabIndex={0}
        className={`${className} cursor-help underline decoration-dotted decoration-[var(--color-skyway)] underline-offset-4`}
      >
        {text}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-60 rounded-xl bg-[var(--color-blue-opal-deep)] px-3 py-2 text-[12.5px] font-normal leading-snug text-white opacity-0 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.6)] transition-opacity duration-200 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}

function scoreColor(score: number | null): string {
  if (score === null) return "var(--color-skyway)";
  if (score >= 75) return "var(--color-blue-opal)";
  if (score >= 50) return "var(--color-toffee)";
  return "var(--color-rythmic-red)";
}

const REL_DOT: Record<RelationshipId, string> = {
  authenticity: "var(--color-tawny-port)",
  bias: "var(--color-rythmic-red)",
  ip: "var(--color-toffee)",
};

const VERDICT_META: Record<Verdict, { label: string; color: string; chip: string }> = {
  ship: { label: "Good to publish", color: "var(--color-blue-opal)", chip: "Ship it" },
  caution: { label: "Publish with caution", color: "var(--color-toffee)", chip: "Caution" },
  rework: { label: "Rework before publishing", color: "var(--color-rythmic-red)", chip: "Rework" },
};

export function ReelResults({
  result,
  onRestart,
  onTeamMode,
}: {
  result: ReelResult;
  onRestart: () => void;
  onTeamMode: () => void;
}) {
  const v = result.verdict ? VERDICT_META[result.verdict] : null;
  const allChecks = result.relationshipScores.flatMap((rs) => rs.diagnostics);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-8">
      {/* ── Summary: verdict + score + the three bars, all in one ───── */}
      <section className="reveal rounded-3xl bg-white p-6 shadow-[0_30px_80px_-55px_rgba(31,53,81,0.4)] ring-1 ring-black/5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-[var(--color-ink-soft)]/55">Verdict for this Reel</p>
            <h1
              className="font-display mt-2 text-3xl leading-[1.05] sm:text-[2.5rem]"
              style={{ color: v?.color ?? "var(--color-syrah-deep)" }}
            >
              {v?.label ?? "No verdict yet"}
            </h1>
          </div>
          <div
            className="shrink-0 rounded-2xl px-4 py-3 text-center text-white"
            style={{ background: v?.color ?? "var(--color-blue-opal)" }}
          >
            <p className="font-display text-3xl leading-none">{fmt(result.overall)}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/70">/ 100</p>
          </div>
        </div>

        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
          {result.verdictLine}
        </p>

        <div className="mt-6 space-y-3 border-t border-[var(--color-skyway)]/30 pt-5">
          {result.relationshipScores.map((rs) => (
            <div key={rs.relationship} className="flex items-center gap-3">
              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{ background: REL_DOT[rs.relationship] }}
              />
              <span className="w-32 shrink-0 text-sm text-[var(--color-ink)]">{rs.title}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-skyway)]/25">
                <div
                  className="h-full rounded-full transition-[width] duration-700 [transition-timing-function:var(--ease-out-expo)]"
                  style={{ width: `${rs.score ?? 0}%`, background: scoreColor(rs.score) }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-medium text-[var(--color-ink-soft)]">
                {rs.score === null ? "n/a" : fmt(rs.score)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Do this next: top actions, action-first, "why" hidden ───── */}
      {result.topRisks.length > 0 ? (
        <section className="reveal delay-1 mt-10">
          <h2 className="font-display text-xl text-[var(--color-syrah-deep)]">Do this next</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            The {result.topRisks.length} highest-impact fixes for this Reel.
          </p>
          <ol className="mt-4 space-y-3">
            {result.topRisks.map((r, i) => (
              <ActionCard key={r.question.id} item={r} rank={i + 1} />
            ))}
          </ol>
        </section>
      ) : (
        <section className="reveal delay-1 mt-10 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-display text-xl text-[var(--color-syrah-deep)]">Nothing to fix first</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Every relevant lever on this Reel is in place. Keep those practices visible to the team.
          </p>
        </section>
      )}

      {/* ── Full checklist: compact status rows, expandable ─────────── */}
      <details className="reveal delay-2 group mt-8 rounded-2xl bg-white ring-1 ring-black/5">
        <summary className="flex items-center justify-between gap-3 px-5 py-4">
          <span className="font-display text-lg text-[var(--color-syrah-deep)]">
            Full checklist
            <span className="ml-2 text-sm font-normal text-[var(--color-ink-soft)]/55">
              {allChecks.length} levers
            </span>
          </span>
          <span className="chev text-[var(--color-ink-soft)]/50">›</span>
        </summary>
        <ul className="border-t border-[var(--color-skyway)]/25 px-2 pb-2">
          {allChecks.map((d) => (
            <ChecklistRow key={d.question.id} item={d} />
          ))}
        </ul>
      </details>

      {/* ── Research context: collapsed by default ──────────────────── */}
      {result.notes.length > 0 && (
        <details className="reveal delay-2 group mt-4 rounded-2xl bg-[var(--color-paper)] ring-1 ring-[var(--color-skyway)]/40">
          <summary className="flex items-center justify-between gap-3 px-5 py-4">
            <span className="font-display text-base text-[var(--color-syrah-deep)]">
              Context from the research
              <span className="ml-2 text-sm font-normal text-[var(--color-ink-soft)]/55">
                {result.notes.length}
              </span>
            </span>
            <span className="chev text-[var(--color-ink-soft)]/50">›</span>
          </summary>
          <div className="space-y-4 border-t border-[var(--color-skyway)]/30 px-5 py-4">
            {result.notes.map((n) => (
              <div key={n.id}>
                <p className="eyebrow text-[var(--color-syrah)]/75">{n.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
                  {n.body}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* ── Footer actions ──────────────────────────────────────────── */}
      <footer className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="lift rounded-full border border-[var(--color-skyway)]/70 bg-white px-5 py-2.5 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
        >
          Print / PDF
        </button>
        <button
          type="button"
          onClick={onTeamMode}
          className="lift rounded-full border border-[var(--color-skyway)]/70 bg-white px-5 py-2.5 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-syrah)] hover:text-[var(--color-syrah)]"
        >
          Assess our team
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="lift rounded-full bg-[var(--color-syrah)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-syrah-deep)]"
        >
          Check another Reel
        </button>
      </footer>
    </main>
  );
}

function ActionCard({ item, rank }: { item: ScoredDiagnostic; rank: number }) {
  const { question, score } = item;
  const accent = question.relationship ? REL_DOT[question.relationship] : "var(--color-syrah)";
  return (
    <li
      className="rounded-2xl bg-white ring-1 ring-black/5"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm text-[var(--color-ink-soft)]/50">{rank}</span>
          <InfoLabel
            text={question.dimensionLabel}
            tip={question.tooltip}
            className="font-display text-base text-[var(--color-syrah-deep)]"
          />
          <span
            className="eyebrow ml-auto"
            style={{ color: score === 0 ? "var(--color-rythmic-red)" : "var(--color-toffee)" }}
          >
            {score === 0 ? "Gap" : "Partial"}
          </span>
        </div>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink)]">
          {question.fix}
        </p>
        <details className="group mt-2">
          <summary className="inline-flex items-center gap-1 text-[13px] text-[var(--color-ink-soft)]/65 hover:text-[var(--color-syrah)]">
            <span className="chev">›</span> Why it matters
          </summary>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-soft)]/85">
            {question.risk}
          </p>
        </details>
      </div>
    </li>
  );
}

function ChecklistRow({ item }: { item: ScoredDiagnostic }) {
  const { question, score } = item;
  const status =
    score === null
      ? { mark: "–", color: "var(--color-skyway)", label: "N/A" }
      : score >= 100
        ? { mark: "✓", color: "var(--color-blue-opal)", label: "In place" }
        : score >= 50
          ? { mark: "~", color: "var(--color-toffee)", label: "Partly" }
          : { mark: "!", color: "var(--color-rythmic-red)", label: "Gap" };

  return (
    <li className="flex items-center gap-3 rounded-xl px-3 py-2.5">
      <span
        className="grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
        style={{ background: status.color }}
        aria-hidden
      >
        {status.mark}
      </span>
      <span className="flex-1 text-sm text-[var(--color-ink)]">
        <InfoLabel text={question.dimensionLabel} tip={question.tooltip} />
      </span>
      <span className="eyebrow shrink-0" style={{ color: status.color }}>
        {status.label}
      </span>
    </li>
  );
}
