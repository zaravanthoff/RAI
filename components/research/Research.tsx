"use client";

import { ConceptualModel } from "./ConceptualModel";

const SUBQUESTIONS: { n: number; title: string; body: string }[] = [
  {
    n: 1,
    title: "Authenticity & autonomy",
    body: "Marketers see autonomy as one moderator of the link between authenticity and trust, but only one of several. Seven respondents even contradicted the link itself (the authenticity paradox), arguing the trust loss may be transitional. Human craft (8 of 11) and original creativity (7 of 11) carried the strongest evidence.",
  },
  {
    n: 2,
    title: "Algorithmic bias & nonbiasedness",
    body: "Nonbiasedness moderates the link between bias and trust, but respondents relocated where bias starts: upstream, in the marketer's brief, prompts and casting, not the AI. Critical thinking (10 of 11, the strongest theme) and brand-audience fit (7 of 11) both reached the critical threshold.",
  },
  {
    n: 3,
    title: "IP concerns & crediting",
    body: "Crediting was confirmed by nine respondents and expanded into a 'triple-C': credit, consent and compensation. But four argued Gen Z rarely think about training data until a case becomes visible (IP indifference). Creator collaboration and provenance surfaced as the visible practices that make crediting real.",
  },
];

export function Research({ onBack }: { onBack: () => void }) {
  return (
    <main className="relative min-h-screen bg-[var(--color-paper-soft)]">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-7 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition hover:text-[var(--color-syrah)]"
          >
            ← Home
          </button>

          {/* intro */}
          <section className="reveal mt-8">
            <p className="eyebrow text-[var(--color-syrah)]">The research behind this tool</p>
            <h1 className="font-display mt-3 text-balance text-[2rem] leading-[1.06] text-[var(--color-syrah-deep)] sm:text-4xl">
              Responsible AI is something marketers do, not something the AI has.
            </h1>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
              <p>
                This tool is built on a master&apos;s study into how marketing professionals
                can use Generative AI responsibly in Instagram Reels without losing Gen Z&apos;s
                trust. Eleven in-depth interviews (with people at companies including TBWA, ACT
                Agency and Odido) tested a model with three trust challenges, each potentially
                softened by a &quot;Responsible AI&quot; capability.
              </p>
              <p>
                The headline finding ran across all three: the literature locates the trust
                problem in a property of the AI, while the data locates it in the practices
                brands put around the AI. The trust impact is driven by the choices brands make,
                not by AI use itself.
              </p>
            </div>
          </section>
        </div>

        {/* interactive model — full width */}
        <section className="reveal delay-1 mt-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-xl text-[var(--color-syrah-deep)]">
              The conceptual model
            </h2>
            <p className="mt-1 mb-4 text-sm text-[var(--color-ink-soft)]">
              The framework this tool checks against. Hover any element to read what it means.
            </p>
          </div>
          <ConceptualModel />
          <div className="mx-auto max-w-3xl">
            <a
              href="/conceptualmodel.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-syrah)] underline-offset-4 hover:underline"
            >
              Open the original diagram (PDF) →
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-3xl">
          {/* sub-questions */}
          <section className="reveal delay-2 mt-12">
            <h2 className="font-display text-xl text-[var(--color-syrah-deep)]">
              What each relationship found
            </h2>
            <div className="mt-4 space-y-3">
              {SUBQUESTIONS.map((s) => (
                <div key={s.n} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-amberlight)] font-display text-sm text-[var(--color-syrah-deep)]">
                      {s.n}
                    </span>
                    <h3 className="font-display text-lg text-[var(--color-syrah-deep)]">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* method note */}
          <section className="reveal delay-3 mt-10 rounded-2xl bg-[var(--color-paper)] p-5 ring-1 ring-[var(--color-skyway)]/40">
            <p className="eyebrow text-[var(--color-syrah)]/75">A note on the evidence</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
              A theme had to appear across at least four respondents to count as an emergent
              moderator, and seven or more to be a critical finding. The study interviews
              marketing professionals about Gen Z behaviour, not Gen Z directly, so the
              contradictions are expert readings of Gen Z, not measured audience effects.
            </p>
          </section>

          <div className="reveal delay-3 mt-10 text-center">
            <button
              type="button"
              onClick={onBack}
              className="lift rounded-full bg-[var(--color-syrah)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-syrah-deep)]"
            >
              Back to the tool →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
