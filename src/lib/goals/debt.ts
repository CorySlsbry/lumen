/**
 * Debt-payoff math — snowball and avalanche strategies.
 *
 * All amounts in cents. APR is annual percentage rate as a decimal (0.18 = 18%).
 */

export type Debt = {
  id: string;
  name: string;
  balanceCents: number;
  apr: number;
  minPaymentCents: number;
};

export type Strategy = "snowball" | "avalanche";

export type PayoffSchedule = {
  strategy: Strategy;
  monthsToFreedom: number;
  totalInterestCents: number;
  payoffOrder: { id: string; name: string; payoffMonth: number }[];
};

/**
 * Simulate paying off a list of debts.
 *
 * Snowball: pay smallest balance first (motivation).
 * Avalanche: pay highest APR first (math).
 *
 * Assumes a fixed `extraMonthlyCents` on top of all minimums, applied to the
 * targeted debt. Once a debt is cleared, its minimum + extra rolls forward.
 */
export function simulatePayoff(args: {
  debts: Debt[];
  strategy: Strategy;
  extraMonthlyCents: number;
}): PayoffSchedule {
  const debts = args.debts.map((d) => ({ ...d }));
  let month = 0;
  let totalInterest = 0;
  const payoffOrder: { id: string; name: string; payoffMonth: number }[] = [];

  // Hard cap to prevent infinite loops on under-funded plans.
  const MAX_MONTHS = 12 * 60;

  while (debts.some((d) => d.balanceCents > 0) && month < MAX_MONTHS) {
    month++;
    // Apply interest (monthly compounding).
    for (const d of debts) {
      if (d.balanceCents <= 0) continue;
      const interest = Math.round((d.balanceCents * d.apr) / 12);
      d.balanceCents += interest;
      totalInterest += interest;
    }
    // Sort by strategy to pick the target.
    const active = debts.filter((d) => d.balanceCents > 0);
    const sorted = [...active].sort((a, b) =>
      args.strategy === "snowball" ? a.balanceCents - b.balanceCents : b.apr - a.apr,
    );
    const target = sorted[0];

    // Pay every minimum.
    let pool = args.extraMonthlyCents;
    for (const d of active) {
      const pay = Math.min(d.minPaymentCents, d.balanceCents);
      d.balanceCents -= pay;
      if (d === target) pool += 0; // extras still go to target
      else pool += 0;
    }
    // Apply extra to target.
    if (target.balanceCents > 0 && pool > 0) {
      const pay = Math.min(pool, target.balanceCents);
      target.balanceCents -= pay;
    }
    // Record any paid-off this month.
    for (const d of debts) {
      if (d.balanceCents <= 0 && !payoffOrder.find((p) => p.id === d.id)) {
        payoffOrder.push({ id: d.id, name: d.name, payoffMonth: month });
      }
    }
  }

  return {
    strategy: args.strategy,
    monthsToFreedom: month,
    totalInterestCents: totalInterest,
    payoffOrder,
  };
}

/**
 * Recommend the better strategy for a given debt set + extra payment budget.
 * Returns avalanche if it saves more than 5% of total interest vs snowball.
 */
export function recommendStrategy(args: {
  debts: Debt[];
  extraMonthlyCents: number;
}): { recommended: Strategy; rationale: string } {
  const snow = simulatePayoff({ ...args, strategy: "snowball" });
  const aval = simulatePayoff({ ...args, strategy: "avalanche" });
  const interestSavedByAvalanche = snow.totalInterestCents - aval.totalInterestCents;
  const significant =
    snow.totalInterestCents > 0 &&
    interestSavedByAvalanche / snow.totalInterestCents > 0.05;
  if (significant) {
    return {
      recommended: "avalanche",
      rationale: `Avalanche saves you ~$${(interestSavedByAvalanche / 100).toFixed(0)} in interest. Higher-APR debt first.`,
    };
  }
  return {
    recommended: "snowball",
    rationale: `Snowball — the motivation of clearing a balance early outweighs the small interest difference. Smallest balance first.`,
  };
}
