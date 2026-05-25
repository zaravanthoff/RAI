# RAI-in-Reels Assessment Tool

A self-assessment instrument for marketing teams to score their Generative-AI practice in Instagram Reels against the moderators that emerged from the study.

See `PRD.md` for the full design rationale.

## Run

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000> (or the next free port).

## What's where

```
app/                      Next.js App Router entry
  layout.tsx              Root layout, fonts (Fraunces + Inter)
  page.tsx                Mounts <AssessmentApp/>
  globals.css             Tailwind v4 + Pantone palette tokens

components/
  AssessmentApp.tsx       Top-level orchestrator (landing → 3 sections → results)
  Hero.tsx                Dark hero landing
  SectionCard.tsx         One of the 3 SQ-aligned sections
  LikertInput.tsx         1–5 Likert + "Not sure" (excluded from scoring)
  ProgressBar.tsx         Sticky progress bar across sections
  ResultsDashboard.tsx    Score + recommendations + per-section breakdown
  ResultsRadar.tsx        Recharts radar across all 10 dimensions
  Logo.tsx                Wordmark

data/
  assessment.ts           Sections, dimensions, questions

lib/
  scoring.ts              Likert→0–100, weighted scoring, bands
  storage.ts              localStorage resume
```

## Scoring at a glance

- 5-point Likert (1 Never → 5 Always), plus "Not sure" which is excluded
- Critical-threshold dimensions weighted 1.5× (the rest 1.0×)
- Bands: 0–40 Exposed · 41–60 Developing · 61–80 Practising · 81–100 Embedded
- Per-section and overall scores are weighted means of dimension scores
