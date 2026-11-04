import { describe, expect, test } from "vitest";
import { simulatePayoff, recommendStrategy, type Debt } from "./debt";

const debts: Debt[] = [
  { id: "cc", name: "Credit card", balanceCents: 500_000, apr: 0.22, minPaymentCents: 12_500 },
  { id: "auto", name: "Auto loan", balanceCents: 1_200_000, apr: 0.07, minPaymentCents: 30_000 },
];

describe("simulatePayoff", () => {
  test("snowball pays smaller balance first", () => {
    const r = simulatePayoff({ debts, strategy: "snowball", extraMonthlyCents: 20_000 });
    expect(r.payoffOrder[0].id).toBe("cc");
  });

  test("avalanche pays higher APR first (which is also cc here)", () => {
    const r = simulatePayoff({ debts, strategy: "avalanche", extraMonthlyCents: 20_000 });
    expect(r.payoffOrder[0].id).toBe("cc");
  });

  test("with no extra and enough minimums, both eventually finish", () => {
    const r = simulatePayoff({ debts, strategy: "snowball", extraMonthlyCents: 0 });
    expect(r.payoffOrder.length).toBe(2);
  });
});

describe("recommendStrategy", () => {
  test("returns a strategy and rationale", () => {
    const r = recommendStrategy({ debts, extraMonthlyCents: 20_000 });
    expect(["snowball", "avalanche"]).toContain(r.recommended);
    expect(r.rationale.length).toBeGreaterThan(0);
  });
});
