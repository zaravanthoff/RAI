export type SectionId = "authenticity" | "bias" | "ip";

export type DimensionSource = "literature" | "emergent";

export interface Dimension {
  id: string;
  label: string;
  shortLabel: string;
  section: SectionId;
  source: DimensionSource;
  critical: boolean;
  evidence: string;
  blurb: string;
  strengthCopy: string;
  gapCopy: string;
  recommendation: string;
}

export interface Question {
  id: string;
  dimensionId: string;
  text: string;
  /** Plain-language explanation of what the statement means and how to rate it. */
  help: string;
}

export interface Section {
  id: SectionId;
  number: 1 | 2 | 3;
  title: string;
  subtitle: string;
  capability: string;
  accent: "tawny-port" | "rythmic-red" | "toffee";
}

export const sections: Section[] = [
  {
    id: "authenticity",
    number: 1,
    title: "Authenticity",
    subtitle:
      "How AI in Reels affects whether Gen Z reads the brand as genuine.",
    capability: "Autonomy",
    accent: "tawny-port",
  },
  {
    id: "bias",
    number: 2,
    title: "Algorithmic bias",
    subtitle:
      "Where bias originates in your Reels, and who actively manages it.",
    capability: "Nonbiasedness",
    accent: "rythmic-red",
  },
  {
    id: "ip",
    number: 3,
    title: "Intellectual property",
    subtitle:
      "The visible practices that protect creators when AI is part of the production chain.",
    capability: "Crediting",
    accent: "toffee",
  },
];

export const dimensions: Dimension[] = [
  // ── Section 1: Authenticity ────────────────────────────────────────────
  {
    id: "autonomy",
    label: "Autonomy",
    shortLabel: "Autonomy",
    section: "authenticity",
    source: "literature",
    critical: false,
    evidence: "RAI capability from the literature.",
    blurb:
      "Humans hold final editorial control over GAI outputs in the Reel.",
    strengthCopy:
      "Humans retain clear editorial authority over AI-generated material before it goes live.",
    gapCopy:
      "AI outputs are flowing through with limited human override, that erodes the authenticity signal Gen Z reads in the Reel.",
    recommendation:
      "Make human approval a non-skippable step in the Reels workflow. Define who can override an AI output, on what grounds, and document the override so the practice is visible to the team.",
  },
  {
    id: "human-craft",
    label: "Human craft",
    shortLabel: "Human craft",
    section: "authenticity",
    source: "emergent",
    critical: true,
    evidence: "Emergent: 8 of 11 respondents (critical threshold).",
    blurb:
      "Visible human craft, performance, hand-shot footage, on-camera presence, sits inside the Reel.",
    strengthCopy:
      "Your Reels carry visible human craft, which the study identifies as the single strongest authenticity signal in this set.",
    gapCopy:
      "There is little visible human craft in your Reels. This was the most-cited authenticity recovery lever in the study.",
    recommendation:
      "Brief one element of the Reel, a face, a hand, a real location, that is unambiguously human-made and put it where Gen Z will see it in the first two seconds. Treat full end-to-end AI generation as the exception, not the default.",
  },
  {
    id: "original-creativity",
    label: "Original creativity",
    shortLabel: "Original creativity",
    section: "authenticity",
    source: "emergent",
    critical: true,
    evidence: "Emergent: 7 of 11 respondents (critical threshold).",
    blurb:
      "The Reel starts from a distinctive brand idea, not a generic AI-default concept.",
    strengthCopy:
      "Your team pushes past AI defaults to land on something distinctive, exactly what the study found protects trust.",
    gapCopy:
      "Reels are leaning on generic AI-default concepts. Gen Z increasingly recognises and discounts these.",
    recommendation:
      "Separate ideation from production. Lock the creative concept with humans first, then bring AI in for execution, not the other way round. If the AI suggested the core idea, assume it has suggested it to ten other brands this week.",
  },
  {
    id: "use-case-fit",
    label: "Use-case fit",
    shortLabel: "Use-case fit",
    section: "authenticity",
    source: "emergent",
    critical: false,
    evidence: "Emergent: supporting moderator.",
    blurb:
      "The choice to use GAI matches the specific Reel's creative purpose.",
    strengthCopy:
      "AI is being used where it fits, not by default.",
    gapCopy:
      "AI appears to be the default tool, even where another approach would serve the creative better.",
    recommendation:
      "Add a one-line 'why AI here?' field to your Reels brief. If the team cannot articulate the fit in a sentence, the Reel is a candidate for a different production approach.",
  },

  // ── Section 2: Bias ────────────────────────────────────────────────────
  {
    id: "nonbiasedness",
    label: "Nonbiasedness",
    shortLabel: "Nonbiased output",
    section: "bias",
    source: "literature",
    critical: false,
    evidence: "RAI capability from the literature.",
    blurb:
      "AI-generated Reels are systematically checked for visible stereotypes and exclusion.",
    strengthCopy:
      "Output-stage bias checks are in place.",
    gapCopy:
      "Output is not being systematically reviewed for stereotyping or exclusion before it ships.",
    recommendation:
      "Run a quick five-point bias check on every AI-assisted Reel before publish: who is shown, who is implied, who is missing, who is othered, who is centred.",
  },
  {
    id: "critical-thinking",
    label: "Critical thinking",
    shortLabel: "Critical thinking",
    section: "bias",
    source: "emergent",
    critical: true,
    evidence:
      "Emergent: 10 of 11 respondents (the strongest theme in the dataset).",
    blurb:
      "The team interrogates AI outputs and the team's own briefings, rather than accepting either at face value.",
    strengthCopy:
      "Active critical-thinking practice, the strongest single theme in the study, is established in your team.",
    gapCopy:
      "AI outputs and team briefings are passing through under-challenged. This was the single most-cited bias moderator in the study.",
    recommendation:
      "Make 'what's biased about this brief?' a named step before any AI tool is opened. Empower the most junior person in the room to flag it, they are usually closest to the audience the bias hits.",
  },
  {
    id: "brand-audience-fit",
    label: "Brand-audience fit",
    shortLabel: "Brand-audience fit",
    section: "bias",
    source: "emergent",
    critical: true,
    evidence: "Emergent: 7 of 11 respondents (critical threshold).",
    blurb:
      "AI-generated Reels reflect the lived reality of the actual Gen Z target audience.",
    strengthCopy:
      "Reels are read by Gen Z as recognisably for them.",
    gapCopy:
      "Reels are landing in a Gen Z feed without being checked against the lived reality of that Gen Z segment.",
    recommendation:
      "Before publishing, show the cut to two or three people from the target segment and ask one question: 'Does this feel like it was made for you, or at you?' Act on the answer.",
  },

  // ── Section 3: IP ──────────────────────────────────────────────────────
  {
    id: "crediting",
    label: "Crediting (Triple-C)",
    shortLabel: "Triple-C",
    section: "ip",
    source: "literature",
    critical: false,
    evidence:
      "RAI capability from the literature, expanded by R1 to Credit + Consent + Compensation.",
    blurb:
      "Credit, consent and compensation are treated as a single practice, not as a disclosure tickbox.",
    strengthCopy:
      "Your IP practice covers credit, consent and compensation together, the broader frame R1 introduced.",
    gapCopy:
      "Disclosure may be in place, but consent and compensation are not consistently part of the same practice.",
    recommendation:
      "Treat credit, consent and compensation as one decision, not three. If you cannot point to all three for an AI-assisted Reel, you do not yet have the practice the study describes.",
  },
  {
    id: "creator-collaboration",
    label: "Creator collaboration",
    shortLabel: "Creator collab",
    section: "ip",
    source: "emergent",
    critical: false,
    evidence: "Emergent: 4 of 11 respondents.",
    blurb:
      "Named creators are visibly involved in AI-assisted Reels.",
    strengthCopy:
      "Visible creator collaboration is part of how your Reels are produced.",
    gapCopy:
      "Creators are largely absent from the visible production of your AI-assisted Reels.",
    recommendation:
      "Build at least one named-creator collaboration into each AI-assisted Reels cycle. Visibility of the collaboration is the moderating signal, not the contract behind it.",
  },
  {
    id: "provenance",
    label: "Provenance",
    shortLabel: "Provenance",
    section: "ip",
    source: "emergent",
    critical: true,
    evidence: "Emergent: 5 of 11 respondents (critical threshold).",
    blurb:
      "You can trace and disclose what trained the model and what was generated by it.",
    strengthCopy:
      "Your team can trace and disclose AI provenance in Reels, the practice the study identifies as load-bearing for IP trust.",
    gapCopy:
      "You cannot currently trace where AI-generated assets in your Reels came from. The study identifies this as the practice IP-trust hinges on.",
    recommendation:
      "Log model, prompt and asset source for every AI-generated element in a Reel, and make that log producible on request. Disclose tooling on the Reel itself where the platform allows.",
  },
  {
    id: "legal-guardrails",
    label: "Legal guardrails",
    shortLabel: "Legal guardrails",
    section: "ip",
    source: "emergent",
    critical: false,
    evidence:
      "Emergent: 5 of 11 respondents (managerial antecedent, sits outside the model itself).",
    blurb:
      "Internal legal and compliance review of AI-generated Reels is established and current.",
    strengthCopy:
      "Legal guardrails for AI-assisted Reels are established and your team is current on them.",
    gapCopy:
      "Legal review of AI-generated Reels is ad hoc and the team is not current on the law.",
    recommendation:
      "Stand up a lightweight, named legal review path for AI-assisted Reels and refresh the team's IP-and-AI training at least twice a year, the law is moving faster than annual training cycles.",
  },
];

// Trimmed to one statement per dimension (10 total) for a fast team check.
// The richer, multi-question detail lives in the per-Reel "Check a Reel" flow.
export const questions: Question[] = [
  // Authenticity
  {
    id: "q-autonomy-1",
    dimensionId: "autonomy",
    text: "A human on our team keeps real creative control over AI-generated Reels, reviewing and reworking output rather than shipping it as-is.",
    help: "In other words: does a person actively direct and edit what the AI makes (changing real creative choices) instead of publishing the raw output? Rate high if someone always reviews, reworks and signs off; rate low if AI output often goes live more or less untouched.",
  },
  {
    id: "q-craft-1",
    dimensionId: "human-craft",
    text: "Our AI-assisted Reels contain something visibly human-made (a face, a performance, hand-shot footage) in the first few seconds.",
    help: "Think about whether a viewer can see a clearly human element early on: a real face, a live performance, footage you actually shot. Rate high if most Reels open with something unmistakably human; rate low if they tend to read as fully AI-generated.",
  },
  {
    id: "q-creativity-1",
    dimensionId: "original-creativity",
    text: "Our Reels start from a distinctive brand idea and use AI to execute it, rather than starting from a generic AI-default concept.",
    help: "This is about where the core idea comes from. Rate high if your team locks a distinctive concept first and then uses AI to produce it; rate low if you tend to run with whatever the AI suggests, which often looks like the concept it handed ten other brands.",
  },
  {
    id: "q-usecase-1",
    dimensionId: "use-case-fit",
    text: "When we use GAI in a Reel, the team can articulate in one sentence why AI was the right tool for that specific Reel.",
    help: "This is about using AI on purpose, not by default. Rate high if the team can quickly explain why AI suited that particular Reel; rate low if AI is simply the automatic choice, even where another approach would serve the creative better.",
  },

  // Bias
  {
    id: "q-nonbias-1",
    dimensionId: "nonbiasedness",
    text: "Every AI-generated Reel is checked for visible stereotypes and exclusion (who is shown, who is missing, who is othered) before it is published.",
    help: "This means a deliberate look at the finished cut for who appears, who is left out, and whether anyone is stereotyped. Rate high if you run that check on every AI-assisted Reel before it ships; rate low if it only happens occasionally or by chance.",
  },
  {
    id: "q-critical-1",
    dimensionId: "critical-thinking",
    text: "We interrogate our own briefings and prompts for bias, not just the AI's output.",
    help: "Bias often enters through your own brief, prompts and casting choices, not just the AI's result. Rate high if you actively question those inputs before you generate anything; rate low if you only inspect what the AI gives back.",
  },
  {
    id: "q-baf-1",
    dimensionId: "brand-audience-fit",
    text: "Our AI-generated Reels reflect the lived reality of the specific Gen Z segment we are targeting.",
    help: "This asks whether the people and world shown actually match the Gen Z audience you're trying to reach. Rate high if Reels feel made for that segment and you pressure-test that with them; rate low if the output drifts to a generic default that doesn't reflect them.",
  },

  // IP
  {
    id: "q-triplec-1",
    dimensionId: "crediting",
    text: "We handle credit, consent and compensation together as one practice for AI-assisted Reels, not as an optional disclosure tick-box.",
    help: "This treats crediting as three linked things handled together as standard: crediting sources, getting consent, and paying the people involved. Rate high if you can point to all three on an AI-assisted Reel; rate low if you only disclose AI use, or do none of them.",
  },
  {
    id: "q-collab-1",
    dimensionId: "creator-collaboration",
    text: "Named creators are visibly involved in our AI-assisted Reels, not just behind the scenes.",
    help: "This is about real, visible collaboration with named creators (photographers, artists, models) on AI-assisted work, so the audience can see they were part of it. Rate high if creators are openly credited and involved; rate low if they're absent or kept hidden.",
  },
  {
    id: "q-prov-1",
    dimensionId: "provenance",
    text: "We can trace and disclose the source of the training data and tooling behind the AI-generated assets in our Reels.",
    help: "This asks whether you could show which tool made an asset, and what that tool was trained on, if someone asked. Rate high if you log the tool, prompt and source and could disclose them; rate low if you couldn't trace where the AI assets came from.",
  },
  {
    id: "q-legal-1",
    dimensionId: "legal-guardrails",
    text: "An established internal legal or compliance path reviews AI-generated Reels before they ship.",
    help: "This is about having a real, repeatable legal or compliance check for AI-assisted Reels, not an occasional informal glance. Rate high if review is a standing step and the team keeps current on the law; rate low if it's ad hoc or skipped.",
  },
];

export const dimensionsBySection: Record<SectionId, Dimension[]> = sections.reduce(
  (acc, section) => {
    acc[section.id] = dimensions.filter((d) => d.section === section.id);
    return acc;
  },
  {} as Record<SectionId, Dimension[]>,
);

export const questionsByDimension: Record<string, Question[]> = dimensions.reduce(
  (acc, d) => {
    acc[d.id] = questions.filter((q) => q.dimensionId === d.id);
    return acc;
  },
  {} as Record<string, Question[]>,
);

export const questionsBySection: Record<SectionId, Question[]> = sections.reduce(
  (acc, section) => {
    const dimIds = new Set(dimensionsBySection[section.id].map((d) => d.id));
    acc[section.id] = questions.filter((q) => dimIds.has(q.dimensionId));
    return acc;
  },
  {} as Record<SectionId, Question[]>,
);

export const totalQuestions = questions.length;
