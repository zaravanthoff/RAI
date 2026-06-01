"use client";

import { useState } from "react";
import type { ReelAnswers } from "@/data/reelCheck";
import {
  PLAN_KEYS,
  aiOptions,
  aiPartMeta,
  brandTypeOf,
  brandTypes,
  funnelMeta,
  funnelOptions,
  planArr,
  planReadiness,
  planStr,
} from "@/lib/planComposer";
import { ReelPreview } from "./ReelPreview";

/**
 * The Reel Studio — a single composing surface, deliberately unlike the
 * one-question-per-card flows elsewhere. The marketer describes the real Reel
 * they're about to make and watches it render live; the framing answers that
 * power the responsible-AI brief are gathered as natural parts of composing.
 */
export function PlanComposer({
  answers,
  onAnswer,
  onExit,
  onGenerate,
  onCheckInstead,
}: {
  answers: ReelAnswers;
  onAnswer: (qid: string, value: string | string[]) => void;
  onExit: () => void;
  onGenerate: () => void;
  onCheckInstead: () => void;
}) {
  const [tagDraft, setTagDraft] = useState("");

  const handle = planStr(answers, PLAN_KEYS.handle);
  const brand = brandTypeOf(answers);
  const desc = planStr(answers, PLAN_KEYS.desc);
  const caption = planStr(answers, PLAN_KEYS.caption);
  const hashtags = planArr(answers, PLAN_KEYS.hashtags);
  const aiParts = planArr(answers, "ctx-ai");
  const funnel = typeof answers["ctx-funnel"] === "string" ? (answers["ctx-funnel"] as string) : "";

  const { pct, canGenerate } = planReadiness(answers);

  // ── field handlers ──────────────────────────────────────────────────────
  const pickBrand = (id: string) => {
    const b = brandTypes.find((x) => x.id === id);
    onAnswer(PLAN_KEYS.brandType, id);
    // brand type carries the brand-promise framing the brief reads
    if (b) onAnswer("ctx-promise", b.promise);
  };

  const toggleAi = (id: string) => {
    onAnswer(
      "ctx-ai",
      aiParts.includes(id) ? aiParts.filter((x) => x !== id) : [...aiParts, id],
    );
  };

  const commitTags = (raw: string) => {
    const fresh = raw
      .split(/[\s,#]+/)
      .map((t) => t.trim().replace(/[^\p{L}\p{N}_]/gu, ""))
      .filter(Boolean);
    if (fresh.length === 0) return;
    const merged = [...hashtags];
    for (const t of fresh) if (!merged.includes(t)) merged.push(t);
    onAnswer(PLAN_KEYS.hashtags, merged.slice(0, 12));
    setTagDraft("");
  };

  const removeTag = (t: string) =>
    onAnswer(PLAN_KEYS.hashtags, hashtags.filter((x) => x !== t));

  return (
    <main className="relative min-h-screen bg-[var(--color-paper-soft)]">
      {/* soft accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 50% at 88% 4%, rgba(221,181,141,0.28) 0%, rgba(247,240,230,0) 60%), radial-gradient(40% 46% at 2% 92%, rgba(165,178,199,0.26) 0%, rgba(247,240,230,0) 62%)",
        }}
      />

      {/* header */}
      <header className="reveal mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7 sm:px-8">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition hover:text-[var(--color-syrah)]"
        >
          ← Home
        </button>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 pb-28 pt-6 sm:px-8">
        <div className="reveal max-w-2xl">
          <p className="eyebrow text-[var(--color-syrah)]">Plan a Reel</p>
          <h1 className="font-display mt-3 text-balance text-[2rem] leading-[1.05] text-[var(--color-syrah-deep)] sm:text-4xl">
            Compose the Reel you&apos;re about to make.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)] sm:text-base">
            Describe the video, write the caption, pick your brand and drop in the hashtags.
            It builds live on the right, then turns into a responsible-AI brief made for{" "}
            <span className="text-[var(--color-syrah)]">this exact Reel.</span>
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(280px,340px)]">
          {/* ── composer column ───────────────────────────────────────── */}
          <div className="order-2 space-y-5 lg:order-1">
            {/* brand */}
            <Field
              step="01"
              label="Your brand"
              hint="The handle and what your brand stands for — it sets the bar for AI."
            >
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-skyway)]/50 bg-[var(--color-paper-soft)] px-3 py-2.5 focus-within:border-[var(--color-syrah)]/60">
                <span className="text-[15px] font-semibold text-[var(--color-ink-soft)]/60">@</span>
                <input
                  value={handle}
                  onChange={(e) => onAnswer(PLAN_KEYS.handle, e.target.value.replace(/^@/, ""))}
                  placeholder="yourbrand"
                  maxLength={30}
                  className="w-full bg-transparent text-[15px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)]/40"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {brandTypes.map((b) => {
                  const on = brand?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => pickBrand(b.id)}
                      className={[
                        "lift rounded-xl border px-3 py-2.5 text-left transition",
                        on
                          ? "border-[var(--color-syrah)] bg-[var(--color-syrah)] text-white"
                          : "border-[var(--color-skyway)]/50 bg-white text-[var(--color-ink)] hover:border-[var(--color-syrah)]/50",
                      ].join(" ")}
                    >
                      <span className="text-base">{b.emoji}</span>
                      <span className="mt-1 block text-[13px] font-medium leading-tight">
                        {b.label}
                      </span>
                      <span
                        className={[
                          "mt-0.5 block text-[11px] leading-tight",
                          on ? "text-white/75" : "text-[var(--color-ink-soft)]/60",
                        ].join(" ")}
                      >
                        {b.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* the scene */}
            <Field
              step="02"
              label="Describe your Reel"
              hint="What happens on screen — the scene, the action, the vibe."
            >
              <textarea
                value={desc}
                onChange={(e) => onAnswer(PLAN_KEYS.desc, e.target.value)}
                rows={3}
                maxLength={240}
                placeholder="e.g. A first-person walk through our café at golden hour, a barista's hands pulling a shot, quick cuts to people laughing…"
                className="w-full resize-none rounded-xl border border-[var(--color-skyway)]/50 bg-[var(--color-paper-soft)] px-3.5 py-3 text-[15px] leading-relaxed text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-soft)]/40 focus:border-[var(--color-syrah)]/60"
              />
              <CharCount value={desc} max={240} />
            </Field>

            {/* what AI made */}
            <Field
              step="03"
              label="What is AI making?"
              hint="Tap everything AI generates. This decides which trust risks apply."
            >
              <div className="flex flex-wrap gap-2">
                {aiOptions.map((o) => {
                  const on = aiParts.includes(o.id);
                  const m = aiPartMeta[o.id];
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleAi(o.id)}
                      className={[
                        "lift inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] transition",
                        on
                          ? "border-[var(--color-syrah)] bg-[var(--color-syrah)] text-white"
                          : "border-[var(--color-skyway)]/50 bg-white text-[var(--color-ink)] hover:border-[var(--color-syrah)]/50",
                      ].join(" ")}
                    >
                      <span>{m?.emoji}</span>
                      {m?.short ?? o.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* funnel */}
            <Field
              step="04"
              label="Where does it sit in your funnel?"
              hint="AI carries the steepest trust penalty in upper-funnel brand-building."
            >
              <div className="grid gap-2 sm:grid-cols-3">
                {funnelOptions.map((o) => {
                  const on = funnel === o.id;
                  const m = funnelMeta[o.id];
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onAnswer("ctx-funnel", o.id)}
                      className={[
                        "lift rounded-xl border px-3 py-3 text-left transition",
                        on
                          ? "border-[var(--color-syrah)] bg-[var(--color-syrah)] text-white"
                          : "border-[var(--color-skyway)]/50 bg-white text-[var(--color-ink)] hover:border-[var(--color-syrah)]/50",
                      ].join(" ")}
                    >
                      <span className="text-base">{m?.emoji}</span>
                      <span className="mt-1 block text-[13px] font-medium">{m?.short}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* caption */}
            <Field
              step="05"
              label="Write your caption"
              hint="The words under the Reel. Optional, but it makes the plan sharper."
            >
              <textarea
                value={caption}
                onChange={(e) => onAnswer(PLAN_KEYS.caption, e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Say what this Reel is really about…"
                className="w-full resize-none rounded-xl border border-[var(--color-skyway)]/50 bg-[var(--color-paper-soft)] px-3.5 py-3 text-[15px] leading-relaxed text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-soft)]/40 focus:border-[var(--color-syrah)]/60"
              />
              <CharCount value={caption} max={300} />
            </Field>

            {/* hashtags */}
            <Field
              step="06"
              label="Add hashtags"
              hint="Type a tag and press Enter or space. Up to 12."
            >
              {hashtags.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5">
                  {hashtags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-blue-opal)]/10 px-2.5 py-1 text-[13px] text-[var(--color-blue-opal)]"
                    >
                      #{t}
                      <button
                        type="button"
                        aria-label={`Remove #${t}`}
                        onClick={() => removeTag(t)}
                        className="text-[var(--color-blue-opal)]/60 hover:text-[var(--color-rythmic-red)]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-skyway)]/50 bg-[var(--color-paper-soft)] px-3 py-2.5 focus-within:border-[var(--color-syrah)]/60">
                <span className="text-[15px] font-semibold text-[var(--color-ink-soft)]/60">#</span>
                <input
                  value={tagDraft}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/[\s,]/.test(v)) commitTags(v);
                    else setTagDraft(v.replace(/^#/, ""));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitTags(tagDraft);
                    } else if (e.key === "Backspace" && !tagDraft && hashtags.length) {
                      removeTag(hashtags[hashtags.length - 1]);
                    }
                  }}
                  onBlur={() => commitTags(tagDraft)}
                  placeholder="genz, behindthescenes, madebyus"
                  className="w-full bg-transparent text-[15px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)]/40"
                />
              </div>
            </Field>
          </div>

          {/* ── live preview column ───────────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-6">
              <ReelPreview
                handle={handle}
                brand={brand}
                desc={desc}
                caption={caption}
                hashtags={hashtags}
                aiParts={aiParts}
              />
              <p className="mt-3 text-center text-[12px] text-[var(--color-ink-soft)]/60">
                Live preview · double-tap to like
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* sticky generate bar */}
      <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-skyway)]/40 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-3.5 sm:px-8">
          <div className="hidden flex-1 sm:block">
            <div className="flex items-center justify-between text-[12px] text-[var(--color-ink-soft)]/70">
              <span>{canGenerate ? "Ready when you are" : "Fill the first four to generate"}</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-skyway)]/25">
              <div
                className="h-full rounded-full bg-[var(--color-syrah)] transition-[width] duration-500 [transition-timing-function:var(--ease-out-expo)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onCheckInstead}
            className="hidden text-[13px] text-[var(--color-ink-soft)] underline-offset-4 transition hover:text-[var(--color-syrah)] hover:underline sm:inline"
          >
            Already made it?
          </button>
          <button
            type="button"
            disabled={!canGenerate}
            onClick={onGenerate}
            className={[
              "lift inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium sm:flex-none",
              canGenerate
                ? "bg-[var(--color-syrah)] text-white hover:bg-[var(--color-syrah-deep)]"
                : "cursor-not-allowed bg-[var(--color-skyway)]/50 text-white/70",
            ].join(" ")}
          >
            <span aria-hidden>✦</span> Generate my plan
          </button>
        </div>
      </div>
    </main>
  );
}

// ── building blocks ─────────────────────────────────────────────────────────
function Field({
  step,
  label,
  hint,
  children,
}: {
  step: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal rounded-2xl bg-white p-5 ring-1 ring-black/5 sm:p-6">
      <div className="flex items-baseline gap-2.5">
        <span className="font-display text-[13px] text-[var(--color-syrah)]/45">{step}</span>
        <div>
          <h2 className="font-display text-[1.05rem] text-[var(--color-syrah-deep)]">{label}</h2>
          <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--color-ink-soft)]/75">{hint}</p>
        </div>
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-1.5 text-right text-[11px] text-[var(--color-ink-soft)]/45">
      {value.length}/{max}
    </p>
  );
}
