/**
 * Freelance income smoothing — projecting a steady "paycheck" from variable inflows.
 *
 * Takes monthly net inflows and returns a recommended monthly draw plus a buffer
 * required to absorb variance. Inspired by Profit First and the Digit cashflow model.
 */

export type MonthlyInflow = {
  month: string; // YYYY-MM
  incomeCents: number;
};

export type SmoothingPlan = {
  recommendedMonthlyDrawCents: number;
  bufferTargetCents: number;
  bufferMonths: number;
  rationale: string;
};

/**
 * Recommend a smoothed monthly draw.
 *
 * Math:
 *   - mean = avg monthly income
 *   - std  = sample std deviation
 *   - draw = mean - std (so most months you bank the diff)
 *   - bufferMonths = ceil(std / draw)  (months of cushion at draw rate)
 *   - bufferTarget = draw * bufferMonths
 */
export function recommendSmoothing(history: MonthlyInflow[]): SmoothingPlan {
  if (history.length < 3) {
    return {
      recommendedMonthlyDrawCents: 0,
      bufferTargetCents: 0,
      bufferMonths: 0,
      rationale: "Need at least 3 months of history to recommend a smoothing plan.",
    };
  }
  const incomes = history.map((h) => h.incomeCents);
  const mean = incomes.reduce((a, b) => a + b, 0) / incomes.length;
  const variance =
    incomes.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (incomes.length - 1);
  const std = Math.sqrt(variance);
  const draw = Math.max(0, Math.round(mean - std));
  const bufferMonths = draw > 0 ? Math.max(1, Math.ceil(std / draw)) : 0;
  const bufferTarget = Math.round(draw * bufferMonths);
  return {
    recommendedMonthlyDrawCents: draw,
    bufferTargetCents: bufferTarget,
    bufferMonths,
    rationale: `You averaged $${(mean / 100).toFixed(0)}/mo with a swing of $${(std / 100).toFixed(0)}. Drawing $${(draw / 100).toFixed(0)}/mo keeps you safe on the lean months.`,
  };
}
