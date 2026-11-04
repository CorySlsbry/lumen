/**
 * Referral code generation + discount eligibility.
 *
 * Codes are short, human-shareable, and globally unique within Lumen.
 * Format: 6 chars, base32-ish alphabet (no ambiguous I/O/0/1).
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newReferralCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}

/**
 * Lumen referral rule: refer 2 friends who reach "activated" → 15% off perpetually.
 */
export const REFERRAL_THRESHOLD = 2;
export const REFERRAL_DISCOUNT_PERCENT = 15;

export function eligibleForDiscount(activatedReferrals: number): boolean {
  return activatedReferrals >= REFERRAL_THRESHOLD;
}

export function discountMultiplier(activatedReferrals: number): number {
  return eligibleForDiscount(activatedReferrals)
    ? (100 - REFERRAL_DISCOUNT_PERCENT) / 100
    : 1;
}
