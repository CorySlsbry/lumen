/**
 * Branded ID types — per CLAUDE.md C-5 rule.
 * Catches "passed a goal id where a user id was expected" at compile time.
 */

export type Brand<T, B> = T & { readonly __brand: B };

export type UserId = Brand<string, "UserId">;
export type HouseholdId = Brand<string, "HouseholdId">;
export type GoalId = Brand<string, "GoalId">;
export type TransactionId = Brand<string, "TransactionId">;
export type LedgerEntryId = Brand<string, "LedgerEntryId">;
export type LinkedAccountId = Brand<string, "LinkedAccountId">;
export type ReferralId = Brand<string, "ReferralId">;
export type TarotReadingId = Brand<string, "TarotReadingId">;

export function newId<T extends string>(): T {
  // Use crypto.randomUUID in runtime (Node 20+ / modern browsers)
  return crypto.randomUUID() as T;
}
