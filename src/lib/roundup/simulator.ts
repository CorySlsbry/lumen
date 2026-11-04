/**
 * Round-up simulator — Phase 1 "shadow savings" core.
 *
 * Pure functions only. NO DB access here — pass transactions in, get round-ups
 * out. The persistence layer wraps these and writes to the ledger.
 *
 * Owned by the Backend Agent.
 */

import type { PersonaId } from "@/lib/personas";

export type RoundUpRule = "nearest_dollar" | "nearest_5" | "nearest_10";

export type TxInput = {
  /** Transaction amount in cents. Positive = debit (spend). */
  amountCents: number;
};

export type RoundUpResult = {
  roundUpCents: number;
  rule: RoundUpRule;
};

/**
 * Compute the round-up for a single transaction under a given rule.
 *
 * Example: spend $4.43 with nearest_dollar → round-up = $0.57 (57 cents).
 * Refunds (negative amounts) and zero never round up.
 */
export function computeRoundUp(
  tx: TxInput,
  rule: RoundUpRule = "nearest_dollar",
): RoundUpResult {
  if (tx.amountCents <= 0) return { roundUpCents: 0, rule };
  const step = roundingStep(rule);
  const remainder = tx.amountCents % step;
  const roundUpCents = remainder === 0 ? 0 : step - remainder;
  return { roundUpCents, rule };
}

function roundingStep(rule: RoundUpRule): number {
  switch (rule) {
    case "nearest_dollar":
      return 100;
    case "nearest_5":
      return 500;
    case "nearest_10":
      return 1000;
  }
}

/**
 * Sum round-ups across many transactions.
 */
export function totalRoundUps(
  transactions: TxInput[],
  rule: RoundUpRule = "nearest_dollar",
): number {
  return transactions.reduce((sum, t) => sum + computeRoundUp(t, rule).roundUpCents, 0);
}

/**
 * Persona-aware default rule. Freelancers and debt-payoff folks start gentle.
 */
export function defaultRuleForPersona(persona: PersonaId): RoundUpRule {
  switch (persona) {
    case "freelancer":
    case "debt_payoff":
      return "nearest_dollar";
    case "parent":
    case "rainy_day":
      return "nearest_dollar";
    case "recent_grad":
    case "financially_curious":
      return "nearest_dollar";
  }
}
