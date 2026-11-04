/**
 * Pure-logic unit tests for the round-up simulator (CLAUDE.md T-1, T-3).
 * No DB. No mocks. Just math.
 */

import { describe, expect, test } from "vitest";
import { computeRoundUp, totalRoundUps } from "./simulator";

describe("computeRoundUp", () => {
  test("rounds $4.43 up to $5.00 → 57c with nearest_dollar", () => {
    expect(computeRoundUp({ amountCents: 443 }).roundUpCents).toBe(57);
  });

  test("returns 0 for an exact dollar amount", () => {
    expect(computeRoundUp({ amountCents: 500 }).roundUpCents).toBe(0);
  });

  test("returns 0 for $0 transactions", () => {
    expect(computeRoundUp({ amountCents: 0 }).roundUpCents).toBe(0);
  });

  test("returns 0 for refunds (negative amounts)", () => {
    expect(computeRoundUp({ amountCents: -250 }).roundUpCents).toBe(0);
  });

  test("rounds $4.43 up to $5.00 → 57c with nearest_5 only if remainder hits", () => {
    // $4.43 → nearest_5 means nearest $5.00, so up to $5.00 = 57c
    expect(computeRoundUp({ amountCents: 443 }, "nearest_5").roundUpCents).toBe(57);
  });

  test("rounds $6.00 up to $10.00 → $4.00 with nearest_5", () => {
    expect(computeRoundUp({ amountCents: 600 }, "nearest_5").roundUpCents).toBe(400);
  });

  test("rounds $11.50 up to $20.00 → $8.50 with nearest_10", () => {
    expect(computeRoundUp({ amountCents: 1150 }, "nearest_10").roundUpCents).toBe(850);
  });
});

describe("totalRoundUps", () => {
  test("sums round-ups across many transactions", () => {
    const txs = [
      { amountCents: 443 }, // 57c
      { amountCents: 312 }, // 88c
      { amountCents: 999 }, // 1c
      { amountCents: 100 }, // 0c
    ];
    expect(totalRoundUps(txs)).toBe(57 + 88 + 1 + 0);
  });

  test("empty array sums to zero", () => {
    expect(totalRoundUps([])).toBe(0);
  });
});
