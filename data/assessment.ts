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
      "Where bias originates in your Reels — and who actively manages it.",
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
      "AI outputs are flowing through with limited human override — that erodes the authenticity signal Gen Z reads in the Reel.",
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
    evidence: "Emergent — 8 of 11 respondents (critical threshold).",
    blurb:
      "Visible human craft — performance, hand-shot footage, on-camera presence — sits inside the Reel.",
    strengthCopy:
      "Your Reels carry visible human craft, which the study identifies as the single strongest authenticity signal in this set.",
    gapCopy:
      "There is little visible human craft in your Reels. This was the most-cited authenticity recovery lever in the study.",
    recommendation:
      "Brief one element of the Reel — a face, a hand, a real location — that is unambiguously human-made and put it where Gen Z will see it in the first two seconds. Treat full end-to-end AI generation as the exception, not the default.",
  },
  {
    id: "original-creativity",
    label: "Original creativity",
    shortLabel: "Original creativity",
    section: "authenticity",
    source: "emergent",
    critical: true,
    evidence: "Emergent — 7 of 11 respondents (critical threshold).",
    blurb:
      "The Reel starts from a distinctive brand idea, not a generic AI-default concept.",
    strengthCopy:
      "Your team pushes past AI defaults to land on something distinctive — exactly what the study found protects trust.",
    gapCopy:
      "Reels are leaning on generic AI-default concepts. Gen Z increasingly recognises and discounts these.",
    recommendation:
      "Separate ideation from production. Lock the creative concept with humans first, then bring AI in for execution — not the other way round. If the AI suggested the core idea, assume it has suggested it to ten other brands this week.",
  },
  {
    id: "use-case-fit",
    label: "Use-case fit",
    shortLabel: "Use-case fit",
    section: "authenticity",
    source: "emergent",
    critical: false,
    evidence: "Emergent — supporting moderator.",
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
      "Emergent — 10 of 11 respondents (the strongest theme in the dataset).",
    blurb:
      "The team interrogates AI outputs and the team's own briefings, rather than accepting either at face value.",
    strengthCopy:
      "Active critical-thinking practice — the strongest single theme in the study — is established in your team.",
    gapCopy:
      "AI outputs and team briefings are passing through under-challenged. This was the single most-cited bias moderator in the study.",
    recommendation:
      "Make 'what's biased about this brief?' a named step before any AI tool is opened. Empower the most junior person in the room to flag it — they are usually closest to the audience the bias hits.",
  },
  {
    id: "brand-audience-fit",
    label: "Brand-audience fit",
    shortLabel: "Brand-audience fit",
    section: "bias",
    source: "emergent",
    critical: true,
    evidence: "Emergent — 7 of 11 respondents (critical threshold).",
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
      "Your IP practice covers credit, consent and compensation together — the broader frame R1 introduced.",
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
    evidence: "Emergent — 4 of 11 respondents.",
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
    evidence: "Emergent — 5 of 11 respondents (critical threshold).",
    blurb:
      "You can trace and disclose what trained the model and what was generated by it.",
    strengthCopy:
      "Your team can trace and disclose AI provenance in Reels — the practice the study identifies as load-bearing for IP trust.",
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
      "Emergent — 5 of 11 respondents (managerial antecedent, sits outside the model itself).",
    blurb:
      "Internal legal and compliance review of AI-generated Reels is established and current.",
    strengthCopy:
      "Legal guardrails for AI-assisted Reels are established and your team is current on them.",
    gapCopy:
      "Legal review of AI-generated Reels is ad hoc and the team is not current on the law.",
    recommendation:
      "Stand up a lightweight, named legal review path for AI-assisted Reels and refresh the team's IP-and-AI training at least twice a year — the law is moving faster than annual training cycles.",
  },
];

export const questions: Question[] = [
  // Autonomy
  {
    id: "q-autonomy-1",
    dimensionId: "autonomy",
    text: "A human on our team has final editorial control over every AI-generated Reel before it is published.",
  },
  {
    id: "q-autonomy-2",
    dimensionId: "autonomy",
    text: "When AI suggests a creative choice we disagree with, the team overrides it without friction.",
  },

  // Human craft
  {
    id: "q-craft-1",
    dimensionId: "human-craft",
    text: "Our AI-assisted Reels contain something visibly human-made — a face, a performance, hand-shot footage — in the first few seconds.",
  },
  {
    id: "q-craft-2",
    dimensionId: "human-craft",
    text: "A Gen Z viewer can tell that real people were involved in producing the Reel.",
  },

  // Original creativity
  {
    id: "q-creativity-1",
    dimensionId: "original-creativity",
    text: "Our Reels start from an original brand idea rather than from an AI-generated concept.",
  },
  {
    id: "q-creativity-2",
    dimensionId: "original-creativity",
    text: "We push back on AI's first outputs and rework them until they are distinctive to our brand.",
  },

  // Use-case fit
  {
    id: "q-usecase-1",
    dimensionId: "use-case-fit",
    text: "When we use GAI in a Reel, the team can articulate in one sentence why AI was the right tool for that specific Reel.",
  },

  // Nonbiasedness
  {
    id: "q-nonbias-1",
    dimensionId: "nonbiasedness",
    text: "Every AI-generated Reel is checked for visible stereotypes and exclusion before it is published.",
  },
  {
    id: "q-nonbias-2",
    dimensionId: "nonbiasedness",
    text: "The representation in our final Reels output reflects the diversity we want to be associated with as a brand.",
  },

  // Critical thinking
  {
    id: "q-critical-1",
    dimensionId: "critical-thinking",
    text: "Our team interrogates AI outputs rather than accepting them at face value.",
  },
  {
    id: "q-critical-2",
    dimensionId: "critical-thinking",
    text: "Junior team members feel empowered to flag bias in AI outputs or in our own briefings.",
  },
  {
    id: "q-critical-3",
    dimensionId: "critical-thinking",
    text: "We actively examine what biases our own briefings and prompts may be introducing into the AI.",
  },

  // Brand-audience fit
  {
    id: "q-baf-1",
    dimensionId: "brand-audience-fit",
    text: "Our AI-generated Reels reflect the lived reality of the specific Gen Z segment we are targeting.",
  },
  {
    id: "q-baf-2",
    dimensionId: "brand-audience-fit",
    text: "We test AI-generated Reels with people from the target audience before publishing.",
  },

  // Triple-C
  {
    id: "q-triplec-1",
    dimensionId: "crediting",
    text: "We disclose AI involvement clearly on Reels where it materially shaped what the viewer sees.",
  },
  {
    id: "q-triplec-2",
    dimensionId: "crediting",
    text: "We obtain explicit consent from anyone whose likeness, voice or style informs AI-generated material in our Reels.",
  },
  {
    id: "q-triplec-3",
    dimensionId: "crediting",
    text: "We fairly compensate creators whose style or work informs our AI-generated Reels output.",
  },

  // Creator collaboration
  {
    id: "q-collab-1",
    dimensionId: "creator-collaboration",
    text: "Named creators are visibly involved in our AI-assisted Reels — not just behind the scenes.",
  },

  // Provenance
  {
    id: "q-prov-1",
    dimensionId: "provenance",
    text: "We can trace the source of training data and tooling behind the AI-generated assets in our Reels.",
  },
  {
    id: "q-prov-2",
    dimensionId: "provenance",
    text: "If a journalist or regulator asked us to show what trained the AI behind a specific Reel, we could.",
  },

  // Legal guardrails
  {
    id: "q-legal-1",
    dimensionId: "legal-guardrails",
    text: "An established internal legal or compliance path reviews AI-generated Reels before they ship.",
  },
  {
    id: "q-legal-2",
    dimensionId: "legal-guardrails",
    text: "Our team is current on copyright and IP rules that affect AI-generated content.",
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
