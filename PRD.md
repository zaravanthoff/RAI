# RAI-in-Reels Tool — PRD

A practical instrument for marketing teams to check whether their Generative-AI use in Instagram Reels protects Gen Z brand trust, grounded in the emergent moderators identified in the study.

This is the working tool referenced in the thesis Conclusion and operationalises the finding that responsible AI in Reels is a property of *marketer behaviour*, not of the AI system itself.

---

## 0. Two modes

The tool opens on a mode selector with two ways in:

- **Check a Reel** (primary). An adaptive, branching diagnostic of **one specific** AI-assisted Reel or ad. A few framing questions (funnel stage, what AI generated, brand promise) decide which of the study's levers are even relevant, so the marketer only answers what applies (≈4–15 questions). The output leads with a **publish / caution / rework verdict**, the **top risks**, and a **concrete fix-it checklist** — then a small three-bar dashboard and the study's contextual contradictions (authenticity paradox, IP indifference) as callouts.
- **Assess our team** (secondary). The team-maturity self-assessment described below, trimmed to **one statement per dimension** for a faster read, producing the readiness score + radar.

Sections 1–8 below describe the **team-assessment** mode. The Reel checker is specified in `data/reelCheck.ts` (question graph + branching predicates + per-lever risk/fix copy) and `lib/reelScoring.ts` (verdict logic).

## 1. Goal

Give marketing teams a concrete, fast (≤5 min) instrument to:

1. Diagnose a specific Reel — or score current team practice — across the study's moderators.
2. See where they are strong and where they are weak relative to the critical-threshold themes.
3. Get tailored, study-grounded, **actionable** guidance for the weakest dimensions.

Non-goal: replicate the literature's framing of RAI as built-in AI capabilities. The whole point of the study's contribution is that RAI is enacted in practice, so the tool measures **practices**, not AI specs.

## 2. Target user

Marketing professionals at consumer-facing corporations producing AI-assisted Reels for Gen Z. Used solo by a marketer (to vet a Reel before publishing), or in a team workshop. No login, no backend — works offline once loaded.

## 3. Team-assessment structure

Three sections mirror the thesis sub-questions. Each section assesses one RAI capability from the literature plus the emergent moderators that surfaced around it. Critical-threshold moderators (those that crossed the study's evidence bar) are weighted more heavily in scoring.

### Section 1 — Authenticity (SQ1)

| Dimension | Source | Status |
|---|---|---|
| Autonomy | Literature (RAI capability) | Standard weight |
| Human craft | Emergent (8/11 respondents) | **Critical** |
| Original creativity | Emergent (7/11 respondents) | **Critical** |
| Use-case fit | Emergent | Standard weight |

### Section 2 — Algorithmic bias (SQ2)

| Dimension | Source | Status |
|---|---|---|
| Nonbiasedness | Literature (RAI capability) | Standard weight |
| Critical thinking | Emergent (10/11 — strongest theme in dataset) | **Critical** |
| Brand-audience fit | Emergent (7/11 respondents) | **Critical** |

### Section 3 — Intellectual property (SQ3)

| Dimension | Source | Status |
|---|---|---|
| Crediting (expanded to Triple-C: Credit / Consent / Compensation, from R1) | Literature + R1 extension | Standard weight |
| Creator collaboration | Emergent (4/11 respondents) | Standard weight |
| Provenance | Emergent (5/11 respondents) | **Critical** |
| Legal guardrails | Emergent (5/11 — managerial antecedent) | Standard weight |

## 4. Questions

One statement per dimension (11 total) for a fast team read. Each scored on a 5-point Likert scale:

1 — Never / Not in place
2 — Rarely / Ad hoc
3 — Sometimes / Informal
4 — Often / Documented
5 — Always / Established practice

Plus an explicit "Not sure" option that is excluded from scoring (so users don't inflate scores by guessing).

Full question list lives in `data/questions.ts` — drafted in the build, reviewable by the user.

## 5. Scoring

- **Per-dimension score:** mean of the dimension's Likert responses, normalised to 0–100.
- **Per-section score:** weighted mean of the dimensions in that section. Critical-threshold dimensions weight = 1.5; others = 1.0.
- **Overall RAI-in-Reels readiness score:** weighted mean across all dimensions (0–100).
- **Band labels:**
  - 0–40 — Exposed
  - 41–60 — Developing
  - 61–80 — Practising
  - 81–100 — Embedded

## 6. Output (results screen)

1. **Headline score** with band label and one-sentence interpretation.
2. **Radar chart** across the 7 emergent moderators (the literature capabilities — autonomy / nonbiasedness / crediting — appear in the per-section breakdown but not the radar, because the study's contribution is the emergent moderators).
3. **Per-section breakdown:** for each of the three sub-question areas, show the section score, top strength, and biggest gap.
4. **Recommendations:** the three lowest-scoring dimensions each get a tailored 2–3 sentence recommendation drawn from the study's findings.
5. **Print / export to PDF** via browser print stylesheet (no backend).
6. **Restart** button to retake.

## 7. Design language

Palette (Pantone references from the brief):

| Token | Pantone | Hex (approx) | Use |
|---|---|---|---|
| `--syrah` | 19-1535 TCX | `#6E2934` | Primary — headings, key CTAs, dark hero |
| `--blue-opal` | 19-4120 TCX | `#1F3551` | Secondary — body dark surfaces, secondary CTA |
| `--tawny-port` | 19-1725 TCX | `#6B3138` | Accent — section 1 accent |
| `--rythmic-red` | 19-1653 TCX | `#9C3D3D` | Accent — alerts / lowest band |
| `--toffee` | 18-1031 TCX | `#704B2C` | Accent — section 3 accent |
| `--skyway` | 14-4112 TCX | `#A5B2C7` | Light — chart fills, dividers |
| `--amberlight` | 14-1217 TCX | `#DDB58D` | Light — backgrounds, highlight band |

Typography: serif display headings (Fraunces or similar via next/font) + clean sans body (Inter). Generous whitespace, editorial feel — meant to look like a tool a serious marketing team would actually use, not a clinical questionnaire.

Layout: dark hero landing, light cards for the question flow, dark results dashboard. Smooth section transitions. Progress bar across the top during the assessment.

Responsive: mobile-first. Questions stack one-per-screen on mobile with swipe/scroll between them; on desktop a section's questions appear together on one card.

## 8. Tech

- Next.js 15 (App Router) + TypeScript
- TailwindCSS v4 with palette tokens defined as CSS variables
- `recharts` for the radar chart
- `next/font` for Fraunces + Inter
- All state in React; no backend; `localStorage` to resume an in-progress assessment

## 9. Out of scope (v1)

- User accounts, team benchmarking, longitudinal tracking
- Backend / database / API routes
- Multi-language (English only)
- A11y audit beyond keyboard-navigable + sufficient contrast (will pass WCAG AA on color but not professionally audited)

## 10. Acceptance

- `pnpm dev` runs at `localhost:3000` with no errors.
- Full flow works end-to-end on desktop and mobile widths: landing → 3 sections → results.
- Score and radar update correctly from sample answers.
- "Not sure" is excluded from averages.
- Print preview produces a clean one/two-page report.
