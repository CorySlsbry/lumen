/**
 * Canonical six-demographic persona data.
 *
 * Owned by the CX Agent. Used by:
 *   - Landing page persona switcher (Hormozi pain → relief copy)
 *   - Onboarding wizard branching (Dante funnel)
 *   - Goal templates (per persona defaults)
 *   - Article library tagging
 *   - Analytics segmentation
 *
 * If you change a persona key, search the codebase — these strings are the
 * single source of truth for segmentation.
 */

export const PERSONAS = [
  {
    id: "recent_grad",
    label: "Recent grad",
    pain: "I have no idea how to start.",
    promise: "Your first $1,000, on autopilot.",
    gradient: "from-fuchsia-500 via-pink-500 to-amber-400",
    icon: "GraduationCap",
    defaultGoal: { kind: "rainy_day", name: "First $1,000", targetCents: 100_000 },
    onboardingNudge:
      "We start small. Round-ups from your daily spending build a cushion before you notice.",
  },
  {
    id: "parent",
    label: "Parent",
    pain: "Two incomes, four mouths, no plan.",
    promise: "Family money, one source of truth.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: "Users",
    defaultGoal: {
      kind: "rainy_day",
      name: "Family emergency fund (3 months)",
      targetCents: 1_500_000,
    },
    onboardingNudge:
      "Invite your partner and kids — Lumen handles shared visibility, allowances, and goals.",
  },
  {
    id: "debt_payoff",
    label: "Crushing debt",
    pain: "I owe more than I make.",
    promise: "A snowball you can actually push.",
    gradient: "from-rose-500 via-red-500 to-orange-500",
    icon: "Flame",
    defaultGoal: {
      kind: "debt_payoff",
      name: "Debt-free year one",
      targetCents: 500_000,
    },
    onboardingNudge:
      "Snowball or avalanche — we'll model both and show you the faster path.",
  },
  {
    id: "financially_curious",
    label: "Curious learner",
    pain: "I want to understand, not just be told.",
    promise: "Learn the money game without the lectures.",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    icon: "Sparkles",
    defaultGoal: {
      kind: "custom",
      name: "Learn one thing a week",
      targetCents: 0,
    },
    onboardingNudge:
      "Daily card pulls and a guided library. Concepts that stick, not jargon that doesn't.",
  },
  {
    id: "freelancer",
    label: "Freelance / variable",
    pain: "Feast one month, starve the next.",
    promise: "Smooth your income, not your nerves.",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    icon: "Waves",
    defaultGoal: {
      kind: "freelance_smoothing",
      name: "3-month income buffer",
      targetCents: 1_800_000,
    },
    onboardingNudge:
      "We watch your cashflow rhythm and route round-ups when you can spare them.",
  },
  {
    id: "rainy_day",
    label: "Rainy-day fund",
    pain: "One emergency from disaster.",
    promise: "Build the cushion before you need it.",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    icon: "Umbrella",
    defaultGoal: {
      kind: "rainy_day",
      name: "$1,000 starter cushion",
      targetCents: 100_000,
    },
    onboardingNudge:
      "Pick a target. We'll get there in tiny pieces you won't miss.",
  },
] as const;

export type PersonaId = (typeof PERSONAS)[number]["id"];
export type Persona = (typeof PERSONAS)[number];

export function getPersona(id: PersonaId): Persona {
  const p = PERSONAS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown persona: ${id}`);
  return p;
}
