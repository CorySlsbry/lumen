import { describe, expect, test } from "vitest";
import {
  evaluateSavingsBadges,
  evaluateStreakBadges,
  nextStreak,
} from "./engine";

describe("nextStreak", () => {
  test("first ever visit starts at 1", () => {
    expect(
      nextStreak({
        previousStreak: 0,
        lastVisitISO: null,
        nowISO: "2026-05-11T10:00:00Z",
      }),
    ).toBe(1);
  });

  test("same-day visit does not change streak", () => {
    expect(
      nextStreak({
        previousStreak: 5,
        lastVisitISO: "2026-05-11T03:00:00Z",
        nowISO: "2026-05-11T23:00:00Z",
      }),
    ).toBe(5);
  });

  test("next-day visit increments", () => {
    expect(
      nextStreak({
        previousStreak: 5,
        lastVisitISO: "2026-05-10T22:00:00Z",
        nowISO: "2026-05-11T01:00:00Z",
      }),
    ).toBe(6);
  });

  test("gap of 2+ days resets to 1", () => {
    expect(
      nextStreak({
        previousStreak: 20,
        lastVisitISO: "2026-05-08T12:00:00Z",
        nowISO: "2026-05-11T12:00:00Z",
      }),
    ).toBe(1);
  });
});

describe("evaluateSavingsBadges", () => {
  test("no badges below $1", () => {
    expect(evaluateSavingsBadges(99)).toEqual([]);
  });

  test("$1 → first_dollar only", () => {
    expect(evaluateSavingsBadges(100)).toEqual(["first_dollar"]);
  });

  test("$1,000 unlocks the full tier", () => {
    expect(evaluateSavingsBadges(100_000)).toEqual([
      "first_dollar",
      "first_5",
      "first_25",
      "first_100",
      "first_500",
      "first_1k",
    ]);
  });
});

describe("evaluateStreakBadges", () => {
  test("100-day streak unlocks all streak badges", () => {
    expect(evaluateStreakBadges(100)).toEqual([
      "streak_3",
      "streak_7",
      "streak_30",
      "streak_100",
    ]);
  });
});
