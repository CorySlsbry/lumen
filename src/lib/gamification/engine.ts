/**
 * Gamification engine — streaks, badges, milestones.
 * Pure functions; persistence is a thin wrapper above.
 *
 * Owned by the Backend Agent with CX Agent input on badge copy.
 */

import type { PersonaId } from "@/lib/personas";

export type BadgeKey =
  | "first_dollar"
  | "first_5"
  | "first_25"
  | "first_100"
  | "first_500"
  | "first_1k"
  | "streak_3"
  | "streak_7"
  | "streak_30"
  | "streak_100"
  | "goal_smashed"
  | "first_referral"
  | "tarot_curious"
  | "stargazer";

export type BadgeMeta = {
  key: BadgeKey;
  title: string;
  caption: string;
  gradient: string;
};

export const BADGES: Record<BadgeKey, BadgeMeta> = {
  first_dollar: {
    key: "first_dollar",
    title: "First Dollar",
    caption: "The hardest one. You crossed the line.",
    gradient: "from-amber-300 to-yellow-500",
  },
  first_5: {
    key: "first_5",
    title: "Fiver",
    caption: "$5 saved. Coffee on your future self.",
    gradient: "from-amber-400 to-orange-500",
  },
  first_25: {
    key: "first_25",
    title: "Quarter Pounder",
    caption: "$25 stacked. Momentum is real.",
    gradient: "from-orange-400 to-rose-500",
  },
  first_100: {
    key: "first_100",
    title: "Hundo",
    caption: "$100. Most people never get here.",
    gradient: "from-rose-400 to-fuchsia-500",
  },
  first_500: {
    key: "first_500",
    title: "Five Hundo",
    caption: "$500. Your runway is forming.",
    gradient: "from-fuchsia-400 to-violet-500",
  },
  first_1k: {
    key: "first_1k",
    title: "Comma Club",
    caption: "$1,000. That's a comma. You earned it.",
    gradient: "from-violet-400 to-indigo-500",
  },
  streak_3: {
    key: "streak_3",
    title: "Three In A Row",
    caption: "Three days. The habit is forming.",
    gradient: "from-cyan-400 to-blue-500",
  },
  streak_7: {
    key: "streak_7",
    title: "Lucky Seven",
    caption: "One full week. Show me again.",
    gradient: "from-blue-400 to-indigo-500",
  },
  streak_30: {
    key: "streak_30",
    title: "Iron Month",
    caption: "Thirty days. Most apps don't keep users this long.",
    gradient: "from-indigo-400 to-purple-500",
  },
  streak_100: {
    key: "streak_100",
    title: "Centurion",
    caption: "100 days. Unhinged. Beautiful.",
    gradient: "from-purple-400 to-fuchsia-500",
  },
  goal_smashed: {
    key: "goal_smashed",
    title: "Goal Smashed",
    caption: "You set a target. You crossed it.",
    gradient: "from-emerald-400 to-teal-500",
  },
  first_referral: {
    key: "first_referral",
    title: "Spread The Light",
    caption: "Brought a friend in. They thank you.",
    gradient: "from-pink-400 to-rose-500",
  },
  tarot_curious: {
    key: "tarot_curious",
    title: "Querent",
    caption: "Drew your first card. The deck remembers.",
    gradient: "from-violet-500 to-indigo-600",
  },
  stargazer: {
    key: "stargazer",
    title: "Stargazer",
    caption: "Read your first forecast. The sky is listening.",
    gradient: "from-indigo-500 to-blue-600",
  },
};

/* -------------------------------------------------------------------------- */
/*  Streak math                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Update a streak counter. Returns the new streak value.
 *
 * Rules:
 *   - Same day: no change.
 *   - Next calendar day (UTC): +1.
 *   - Gap of >1 day: resets to 1.
 *   - Never visited before (null): starts at 1.
 */
export function nextStreak(args: {
  previousStreak: number;
  lastVisitISO: string | null;
  nowISO: string;
}): number {
  const { previousStreak, lastVisitISO, nowISO } = args;
  if (!lastVisitISO) return 1;
  const last = new Date(lastVisitISO);
  const now = new Date(nowISO);
  const dayDiff = utcDayDiff(last, now);
  if (dayDiff === 0) return previousStreak;
  if (dayDiff === 1) return previousStreak + 1;
  return 1;
}

function utcDayDiff(a: Date, b: Date): number {
  const aDay = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const bDay = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((bDay - aDay) / 86_400_000);
}

/* -------------------------------------------------------------------------- */
/*  Badge evaluation                                                          */
/* -------------------------------------------------------------------------- */

export function evaluateSavingsBadges(totalCents: number): BadgeKey[] {
  const earned: BadgeKey[] = [];
  if (totalCents >= 100) earned.push("first_dollar");
  if (totalCents >= 500) earned.push("first_5");
  if (totalCents >= 2_500) earned.push("first_25");
  if (totalCents >= 10_000) earned.push("first_100");
  if (totalCents >= 50_000) earned.push("first_500");
  if (totalCents >= 100_000) earned.push("first_1k");
  return earned;
}

export function evaluateStreakBadges(streak: number): BadgeKey[] {
  const earned: BadgeKey[] = [];
  if (streak >= 3) earned.push("streak_3");
  if (streak >= 7) earned.push("streak_7");
  if (streak >= 30) earned.push("streak_30");
  if (streak >= 100) earned.push("streak_100");
  return earned;
}

/* -------------------------------------------------------------------------- */
/*  Persona-aware celebration copy                                            */
/* -------------------------------------------------------------------------- */

export function celebrationCopyFor(persona: PersonaId, badge: BadgeKey): string {
  if (badge === "first_dollar") {
    switch (persona) {
      case "recent_grad":
        return "First dollar. School never taught you that — but you did it.";
      case "debt_payoff":
        return "First dollar that isn't going to debt. That's the turning point.";
      case "freelancer":
        return "A buffer dollar. The first of many quiet rainy-day shields.";
      default:
        return BADGES.first_dollar.caption;
    }
  }
  return BADGES[badge].caption;
}
