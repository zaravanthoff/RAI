// ─────────────────────────────────────────────────────────────────────────
// Adaptive "Check a Reel" model
//
// Instead of rating team practice in the abstract, this flow diagnoses ONE
// specific AI-assisted Reel. A few framing questions (funnel stage, what AI
// generated, brand promise) branch the diagnostic so the marketer only sees
// the questions that actually apply to their Reel. Every diagnostic maps to a
// study finding and carries concrete, practical guidance.
// ─────────────────────────────────────────────────────────────────────────

export type RelationshipId = "authenticity" | "bias" | "ip";

export interface Relationship {
  id: RelationshipId;
  title: string;
  capability: string; // theorised RAI capability from the literature
  accent: "tawny-port" | "rythmic-red" | "toffee";
}

export const relationships: Relationship[] = [
  {
    id: "authenticity",
    title: "Authenticity",
    capability: "Autonomy",
    accent: "tawny-port",
  },
  {
    id: "bias",
    title: "Algorithmic bias",
    capability: "Nonbiasedness",
    accent: "rythmic-red",
  },
  {
    id: "ip",
    title: "Intellectual property",
    capability: "Crediting",
    accent: "toffee",
  },
];

// ── Answers ─────────────────────────────────────────────────────────────
// Context (single) → string id. Context (multi) → string[]. Diagnostic → option id.
export type ReelAnswer = string | string[] | undefined;
export type ReelAnswers = Record<string, ReelAnswer>;

export interface ReelOption {
  id: string;
  label: string;
  /** For diagnostics: 0–100 contribution. `null` = not applicable, excluded from scoring. */
  score?: number | null;
}

export interface ReelQuestion {
  id: string;
  kind: "context" | "diagnostic";
  prompt: string;
  help?: string;
  options: ReelOption[];
  multi?: boolean; // context multi-select
  // diagnostic-only metadata
  relationship?: RelationshipId;
  dimensionId?: string;
  dimensionLabel?: string;
  /** One-line plain-language explanation of the lever, shown on hover. */
  tooltip?: string;
  critical?: boolean;
  /** What goes wrong when this scores low, used in the risk list. */
  risk?: string;
  /** Concrete, practical action to close the gap, used in the checklist. */
  fix?: string;
  /** Show only when this returns true given current answers. Context Qs always show. */
  relevantWhen?: (a: ReelAnswers) => boolean;
}

// ── Answer-shape helpers for branching ────────────────────────────────────
const aiSet = (a: ReelAnswers): Set<string> => {
  const v = a["ctx-ai"];
  return new Set(Array.isArray(v) ? v : []);
};
const aiHas = (a: ReelAnswers, ...keys: string[]) => {
  const s = aiSet(a);
  return keys.some((k) => s.has(k));
};
/** AI did something creative/generative (not just polishing real footage). */
const aiIsGenerative = (a: ReelAnswers): boolean => {
  const s = aiSet(a);
  if (s.size === 0) return false;
  return [...s].some((x) => x !== "edit");
};
const biasRelevant = (a: ReelAnswers) => aiHas(a, "people", "video", "concept");
const likenessRelevant = (a: ReelAnswers) => aiHas(a, "people", "voice", "style");
const substantiveAI = (a: ReelAnswers) =>
  aiHas(a, "people", "voice", "video", "concept", "style");
const brandIsPurposeLed = (a: ReelAnswers) =>
  a["ctx-promise"] === "yes" || a["ctx-promise"] === "somewhat";

// Standard 3-step diagnostic scale (kept consistent so the UI reads cleanly).
const yesPartlyNo = (
  yes: string,
  partly: string,
  no: string,
): ReelOption[] => [
  { id: "yes", label: yes, score: 100 },
  { id: "partly", label: partly, score: 50 },
  { id: "no", label: no, score: 0 },
];
const withNA = (opts: ReelOption[]): ReelOption[] => [
  ...opts,
  { id: "na", label: "Not applicable to this Reel", score: null },
];

// ── The question graph ────────────────────────────────────────────────────
export const reelQuestions: ReelQuestion[] = [
  // ===== Framing / context =================================================
  {
    id: "ctx-funnel",
    kind: "context",
    prompt: "Where does this Reel sit in your funnel?",
    help: "The study found that audiences accept, even welcome, AI in lower-funnel content, but trust it far less in upper-funnel brand-building.",
    options: [
      {
        id: "upper",
        label: "Upper funnel: brand-building, storytelling, emotional",
      },
      {
        id: "lower",
        label: "Lower funnel: product, performance, promo, humour",
      },
      { id: "mixed", label: "A bit of both / not sure" },
    ],
  },
  {
    id: "ctx-ai",
    kind: "context",
    multi: true,
    prompt: "What did AI generate in this Reel?",
    help: "Your answer here decides which trust risks apply to this Reel.",
    options: [
      { id: "people", label: "People, faces or characters" },
      { id: "voice", label: "Voice or spoken audio" },
      { id: "video", label: "Full video or scenes" },
      { id: "music", label: "Music or sound" },
      { id: "concept", label: "The core idea or script" },
      { id: "style", label: "A look or style based on existing artists / work" },
      { id: "edit", label: "Only editing or enhancement of footage we shot" },
    ],
  },
  {
    id: "ctx-promise",
    kind: "context",
    prompt:
      "Does your brand explicitly position itself as human, real, authentic or natural?",
    help: "In the study, a telecom brand that promises to be 'human' undermined itself when its Reels didn't show that, and a nature brand using AI triggered what one marketer called 'a kind of error'.",
    options: [
      { id: "yes", label: "Yes, that's core to how we position the brand" },
      { id: "somewhat", label: "Somewhat, it's part of the mix" },
      { id: "no", label: "No, that's not our positioning" },
    ],
  },

  // ===== Relationship 1 · Authenticity =====================================
  {
    id: "a-craft",
    kind: "diagnostic",
    relationship: "authenticity",
    dimensionId: "human-craft",
    dimensionLabel: "Human craft",
    tooltip:
      "Visible signs that real people made the Reel: a real face, hands, location or performance.",
    critical: true,
    prompt:
      "Is there something visibly human in this Reel that a viewer would notice in the first few seconds (a real face, a real performance, hand-shot footage)?",
    help: "In the study, visible human work was the single strongest way to keep a Reel feeling authentic.",
    options: yesPartlyNo(
      "Yes, clearly human-made elements are front and centre",
      "A little, but it's subtle or buried",
      "No, it reads as effectively all-AI",
    ),
    risk: "With no visible human craft, Gen Z reads the Reel as all-AI. That is the strongest trigger for perceived reduced authenticity the study found.",
    fix: "Add one clearly human moment to the first 2 seconds: a real face, real hands, a real location, or a live performance. Don't let the whole Reel be AI. Use AI to enhance real footage, not replace it.",
    relevantWhen: () => true,
  },
  {
    id: "a-idea",
    kind: "diagnostic",
    relationship: "authenticity",
    dimensionId: "original-creativity",
    dimensionLabel: "Original creativity",
    tooltip:
      "A distinctive idea that came from your team, not a generic AI default.",
    critical: true,
    prompt: "Where did the core creative idea come from?",
    help: "As one founder put it: 'If the creative idea is good, nobody cares how it was made.' A strong idea outweighs any worry about how it was produced; a generic, AI-default concept only makes that worry worse.",
    options: [
      {
        id: "human",
        label: "A distinctive human or brand idea that AI just executed",
        score: 100,
      },
      {
        id: "mix",
        label: "A mix of our idea and AI's suggestions",
        score: 50,
      },
      {
        id: "ai",
        label: "Mostly AI's suggestion, or a generic AI-default concept",
        score: 0,
      },
    ],
    risk: "A generic AI-originated concept is one the model has likely handed to ten other brands this week, weak ideas executed with AI amplify the authenticity penalty rather than solve it.",
    fix: "Lock the core idea as a team before you open any AI tool. Use AI only to produce that idea, not to invent it. If AI suggested the concept, change it: assume competitors got the same suggestion.",
    relevantWhen: aiIsGenerative,
  },
  {
    id: "a-autonomy",
    kind: "diagnostic",
    relationship: "authenticity",
    dimensionId: "autonomy",
    dimensionLabel: "Autonomy",
    tooltip:
      "A human stays in charge of the AI, directing and reworking it rather than just accepting its output.",
    critical: false,
    prompt:
      "Did a human stay in charge of the AI, reviewing and reworking its output instead of accepting it as-is?",
    help: "AI can't judge what's good, so the marketer has to set the direction. As one founder put it: 'AI has no clue what good looks like.'",
    options: yesPartlyNo(
      "Yes, a human directed and reworked it",
      "Some review, but largely as the AI produced it",
      "No, we shipped close to the raw AI output",
    ),
    risk: "Raw AI output shipped with little human direction has no creative point of view. The study frames autonomy as the marketer supplying the 'soul' AI can't.",
    fix: "Add a required human sign-off before publishing. Decide who can reject AI output and why. Never ship raw AI: change at least one creative choice yourself so the Reel has a clear human point of view.",
    relevantWhen: substantiveAI,
  },

  // ===== Relationship 2 · Algorithmic bias =================================
  {
    id: "b-brief",
    kind: "diagnostic",
    relationship: "bias",
    dimensionId: "critical-thinking",
    dimensionLabel: "Critical thinking",
    tooltip:
      "Actively checking your own brief and prompts for bias, not just the AI's result.",
    critical: true,
    prompt:
      "Did you check your own brief and prompts for bias, not just the AI's output?",
    help: "Bias usually comes from the brief and the data you feed in, not from the AI itself, so check your own inputs first.",
    options: [
      {
        id: "yes",
        label: "Yes, we actively checked our brief and prompts",
        score: 100,
      },
      {
        id: "output",
        label: "We checked the output, but not our own brief",
        score: 50,
      },
      { id: "no", label: "No, we didn't really check either", score: 0 },
    ],
    risk: "The study relocates bias upstream: 'the marketer puts the bias in there.' Checking only the output misses where the bias actually enters: your brief, prompts and casting choices.",
    fix: "Before you open the AI tool, ask out loud: 'what could be biased in this brief or prompt?' Write specific prompts, choose who appears on purpose, and invite the most junior person to flag anything off. They're often closest to the audience.",
    relevantWhen: biasRelevant,
  },
  {
    id: "b-output",
    kind: "diagnostic",
    relationship: "bias",
    dimensionId: "nonbiasedness",
    dimensionLabel: "Nonbiasedness",
    tooltip:
      "Checking the finished cut for stereotypes and who is shown, implied or left out.",
    critical: false,
    prompt:
      "Did you check the finished cut for who's shown, who's missing, and any stereotypes?",
    help: "AI tools repeat the patterns in their training data. One team re-prompted repeatedly until the people shown matched the world they wanted to represent.",
    options: yesPartlyNo(
      "Yes, we ran a deliberate representation check",
      "A quick glance, nothing systematic",
      "No, we didn't review it for this",
    ),
    risk: "A biased model won't self-correct: 'you cannot expect a fifty-fifty output from a model that has not been evenly trained.' Unchecked output ships the model's defaults as your brand's choices.",
    fix: "Before publishing, check the cut on five questions: who's shown, who's implied, who's missing, who's stereotyped, who's centred. Re-prompt or recast until it represents the world you want to show.",
    relevantWhen: biasRelevant,
  },
  {
    id: "b-audience",
    kind: "diagnostic",
    relationship: "bias",
    dimensionId: "brand-audience-fit",
    dimensionLabel: "Brand-audience fit",
    tooltip:
      "How well the people shown match the real Gen Z audience you're targeting.",
    critical: true,
    prompt:
      "Does the representation in this Reel reflect the real Gen Z audience you're targeting?",
    help: "If the people in the Reel don't match your real audience, it shows. As one manager said: 'it would really stand out if suddenly only white people appeared in our AI advertising, because we represent the whole of the Netherlands.'",
    options: yesPartlyNo(
      "Yes, it looks like it was made for them",
      "Roughly, but we didn't pressure-test it",
      "No, it doesn't reflect that audience",
    ),
    risk: "If the Reel defaults away from your actual audience, it reads as made 'at' them, not 'for' them, and the bias stands out most for brands that serve a broad or purpose-led market.",
    fix: "Before publishing, show the cut to two or three people from the target segment and ask one question: 'Does this feel like it was made for you, or at you?' Act on the answer.",
    relevantWhen: biasRelevant,
  },
  {
    id: "b-culture",
    kind: "diagnostic",
    relationship: "bias",
    dimensionId: "nonbiasedness",
    dimensionLabel: "Cultural fit",
    tooltip:
      "Whether the Reel respects your audience's cultural, regional or religious context.",
    critical: false,
    prompt:
      "Does the Reel respect the cultural, regional or religious context of your audience, rather than a generic default?",
    help: "AI misses local detail unless you tell it. As one strategist noted, it 'will not think to do something with Ramadan' and 'cannot understand that Frisian feeling.' This covers regional identity, religion and class, not just ethnicity and gender.",
    options: withNA(
      yesPartlyNo(
        "Yes, it lands in our audience's actual context",
        "Partly, it's a fairly generic default",
        "No, it ignores the cultural context entirely",
      ),
    ),
    risk: "Generative defaults flatten cultural, regional and religious specificity. The study flags this as a distinct, under-discussed form of algorithmic bias.",
    fix: "Spell out the cultural details the AI won't know (local references, holidays, regional identity) in your brief. Then have someone from that community review the cut before it goes live.",
    relevantWhen: (a) => biasRelevant(a) && brandIsPurposeLed(a),
  },

  // ===== Relationship 3 · Intellectual property ============================
  {
    id: "ip-disclose",
    kind: "diagnostic",
    relationship: "ip",
    dimensionId: "crediting",
    dimensionLabel: "Disclosure (credit)",
    tooltip:
      "Telling viewers that AI was used where it shaped what they see.",
    critical: false,
    prompt:
      "Is AI use labelled or disclosed wherever it shaped what viewers see?",
    help: "If a brand hides its AI use and viewers later find out, it can backfire. Disclosure is the first step in using AI fairly.",
    options: yesPartlyNo(
      "Yes, it's clearly disclosed",
      "Vaguely, or only if someone digs",
      "No, there's no disclosure",
    ),
    risk: "R6: an audience that forms an emotional connection and later learns it wasn't real 'can feel duped'. Undisclosed AI is the trigger that flips trust to betrayal.",
    fix: "Label the Reel as AI-assisted where it shaped what people see. Use Instagram's AI-content label or a line in the caption. Make disclosure standard, not optional.",
    relevantWhen: aiIsGenerative,
  },
  {
    id: "ip-consent",
    kind: "diagnostic",
    relationship: "ip",
    dimensionId: "crediting",
    dimensionLabel: "Consent",
    tooltip:
      "Getting permission from anyone whose face, voice or style the AI is based on.",
    critical: false,
    prompt:
      "Did you get consent from everyone whose face, voice or style the AI is based on?",
    help: "Using a real person's face, voice or signature style without asking isn't okay, even through AI. As one founder put it: 'if you are a photographer, artist, voice actor and you are suddenly used without consent, that is not okay.'",
    options: withNA(
      yesPartlyNo(
        "Yes, we have explicit consent",
        "Partly / informally",
        "No, no consent was obtained",
      ),
    ),
    risk: "Using a real person's likeness, voice or signature style without consent is the clearest IP and reputational exposure the study surfaced: 'no permission was asked.'",
    fix: "Get written permission from anyone whose face, voice or style the AI is based on, before you produce the Reel. Sign agreements with models and agencies as standard.",
    relevantWhen: likenessRelevant,
  },
  {
    id: "ip-compensate",
    kind: "diagnostic",
    relationship: "ip",
    dimensionId: "creator-collaboration",
    dimensionLabel: "Compensation & collaboration",
    tooltip:
      "Paying or partnering with the creators whose work the AI draws on.",
    critical: false,
    prompt:
      "Are the creators, models or artists whose work the AI draws on paid or collaborating with you?",
    help: "Turn 'AI replacing creators' into 'AI plus creators.' One brand pays photographers a buy-out and shares rights to the images generated from their work.",
    options: withNA(
      yesPartlyNo(
        "Yes, they're paid and/or visibly collaborating",
        "Partly: some are, some aren't",
        "No, no one was compensated or involved",
      ),
    ),
    risk: "R3: if Gen Z notices a brand fired its creatives and replaced them with AI, it can be admired for the visuals but punished on reputation. Uncompensated source creators are the job-displacement risk made concrete.",
    fix: "Pay or partner with at least one named creator on the Reel (a buy-out fee, shared rights, or co-creation), and make that collaboration visible to the audience.",
    relevantWhen: likenessRelevant,
  },
  {
    id: "ip-provenance",
    kind: "diagnostic",
    relationship: "ip",
    dimensionId: "provenance",
    dimensionLabel: "Provenance",
    tooltip:
      "Being able to trace which tool and data source produced the AI assets.",
    critical: true,
    prompt:
      "Can you trace which tool and data source produced the AI assets in this Reel?",
    help: "Brands that want to stay defensible use tools trained on licensed data (like Adobe Firefly or Shutterstock) that let you trace where the content came from.",
    options: yesPartlyNo(
      "Yes, we can trace tool and sourcing",
      "Partly, we know the tool but not the data",
      "No, we couldn't trace or disclose it",
    ),
    risk: "If you can't trace what trained the model behind the Reel, you can't defend it when a case becomes visible, and provenance is the practice the study found IP-trust hinges on.",
    fix: "Keep a simple log of the tool, prompt and source for every AI element, so you can show it if asked. Choose tools trained on licensed data (e.g. Adobe Firefly, Shutterstock) over ones whose training data is unknown.",
    relevantWhen: aiIsGenerative,
  },
  {
    id: "ip-legal",
    kind: "diagnostic",
    relationship: "ip",
    dimensionId: "legal-guardrails",
    dimensionLabel: "Legal guardrails",
    tooltip:
      "A legal or brand check that keeps protected names, people and landmarks out of prompts.",
    critical: false,
    prompt:
      "Did this Reel pass a legal or brand-guideline check (no protected brand names, real people or recognisable landmarks baked into the prompts)?",
    help: "Many teams won't publish without a quick legal check. Some ban brand names, artist style names and famous landmarks from their prompts to avoid copying protected work.",
    options: withNA(
      yesPartlyNo(
        "Yes, it cleared a legal or guideline check",
        "Informally, with no real review",
        "No, it hasn't been checked",
      ),
    ),
    risk: "Prompts containing protected brand names, real people or landmarks are an IP exposure that legal review exists to catch before the Reel ever reaches an audience.",
    fix: "Have someone do a quick legal or brand-guideline check before publishing. Keep brand names, real people and recognisable landmarks out of your prompts.",
    relevantWhen: aiIsGenerative,
  },
];

// ── Contextual nuance notes (the study's contradictions) ──────────────────
export interface NuanceNote {
  id: string;
  title: string;
  body: string;
  /** Show when relevant given answers + the relationship's score. */
  appliesWhen: (a: ReelAnswers, scores: Partial<Record<RelationshipId, number | null>>) => boolean;
}

export const nuanceNotes: NuanceNote[] = [
  {
    id: "authenticity-paradox",
    title: "Context: the authenticity paradox",
    body: "Seven respondents pushed back on the idea that AI automatically costs trust. Because this Reel is lower-funnel, the authenticity penalty is real but softer. Gen Z's stated preference for 'real' often diverges from what it actually engages with, and AI use is normalising fast. Worth fixing, not worth panicking over.",
    appliesWhen: (a, s) =>
      a["ctx-funnel"] === "lower" &&
      typeof s.authenticity === "number" &&
      s.authenticity < 70,
  },
  {
    id: "ip-indifference",
    title: "Context: IP risk is reactive, not constant",
    body: "Four respondents argued most Gen Z don't think about training data in the abstract ('nobody cares') until a specific case becomes visible. A public lawsuit or a viral disclosure flips this risk on instantly. Treat IP as a reactive exposure to contain, not a constant background drag on trust.",
    appliesWhen: (a, s) =>
      aiIsGenerative(a) &&
      typeof s.ip === "number" &&
      s.ip < 70,
  },
  {
    id: "human-brand-promise",
    title: "Context: your brand promise raises the stakes",
    body: "Because your brand positions on being human, real or authentic, AI use in this Reel is held to a higher bar. R5's warning applies directly: if the brand promise is 'human', the Reel has to show that humanness, or the promise itself is undermined.",
    appliesWhen: (a, s) =>
      brandIsPurposeLed(a) &&
      typeof s.authenticity === "number" &&
      s.authenticity < 80,
  },
];

// ── Derived maps ───────────────────────────────────────────────────────────
export const reelDiagnostics = reelQuestions.filter(
  (q) => q.kind === "diagnostic",
);

/** Questions that should be shown given the current answers (context always shown). */
export function visibleQuestions(a: ReelAnswers): ReelQuestion[] {
  return reelQuestions.filter(
    (q) => q.kind === "context" || (q.relevantWhen ? q.relevantWhen(a) : true),
  );
}
