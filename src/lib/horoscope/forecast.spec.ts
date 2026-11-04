import { describe, expect, test } from "vitest";
import { generateWeeklyForecast, isoMonday } from "./forecast";
import { sunSign } from "./zodiac";

describe("sunSign", () => {
  test("Jan 1 is Capricorn", () => {
    expect(sunSign("1990-01-01")).toBe("capricorn");
  });
  test("Mar 21 is Aries", () => {
    expect(sunSign("2000-03-21")).toBe("aries");
  });
  test("Dec 22 is Capricorn", () => {
    expect(sunSign("2000-12-22")).toBe("capricorn");
  });
  test("Feb 18 is Aquarius", () => {
    expect(sunSign("2000-02-18")).toBe("aquarius");
  });
});

describe("isoMonday", () => {
  test("Monday 2026-05-11 returns itself", () => {
    expect(isoMonday(new Date("2026-05-11T12:00:00Z"))).toBe("2026-05-11");
  });
  test("Sunday returns the prior Monday", () => {
    expect(isoMonday(new Date("2026-05-17T12:00:00Z"))).toBe("2026-05-11");
  });
});

describe("generateWeeklyForecast", () => {
  test("deterministic for same sign + week", () => {
    const a = generateWeeklyForecast({ sign: "leo", weekStart: "2026-05-11" });
    const b = generateWeeklyForecast({ sign: "leo", weekStart: "2026-05-11" });
    expect(a).toEqual(b);
  });
  test("different signs in the same week share a theme", () => {
    const leo = generateWeeklyForecast({ sign: "leo", weekStart: "2026-05-11" });
    const virgo = generateWeeklyForecast({ sign: "virgo", weekStart: "2026-05-11" });
    expect(leo.theme).toBe(virgo.theme);
    expect(leo.headline).not.toBe(virgo.headline);
  });
});
