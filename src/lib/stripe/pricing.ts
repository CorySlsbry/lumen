/**
 * Lumen subscription pricing — canonical source of truth.
 *
 * Real Stripe Price IDs live in env vars; this file exposes the dollar amounts
 * for marketing copy and the paywall.
 */

import { REFERRAL_DISCOUNT_PERCENT, discountMultiplier } from "@/lib/referrals/code";

export const PRICING = {
  monthly: {
    priceCents: 499,
    cadence: "month" as const,
    stripeEnvVar: "STRIPE_PRICE_MONTHLY",
    label: "$4.99 / month",
  },
  yearly: {
    priceCents: 3999,
    cadence: "year" as const,
    stripeEnvVar: "STRIPE_PRICE_YEARLY",
    label: "$39.99 / year",
    /** Yearly equivalent to monthly (cents/year). */
    monthlyEquivCents: Math.round(3999 / 12),
    /** Marketing copy: how much you save vs monthly. */
    savingsCopy: "Save 33% vs monthly",
  },
} as const;

export type Plan = keyof typeof PRICING;

export function effectivePrice(plan: Plan, activatedReferrals: number): number {
  return Math.round(PRICING[plan].priceCents * discountMultiplier(activatedReferrals));
}

export function referralCopy(): string {
  return `Refer 2 friends and lock in ${REFERRAL_DISCOUNT_PERCENT}% off — forever.`;
}
