/**
 * Weekly money horoscope generator.
 *
 * Deterministic: same user + same week = same forecast. The "weekly theme"
 * rotates on a 52-week cycle keyed off the year, so users get fresh content
 * but Lumen never has to call an LLM per reading.
 */

import { SIGNS, type Sign } from "./zodiac";

export type WeeklyForecast = {
  weekStart: string; // ISO Monday
  sign: Sign;
  theme: string;
  headline: string;
  body: string;
  luckyDay: string;
  watchOutFor: string;
};

const WEEKLY_THEMES = [
  { theme: "Beginnings", focus: "starting something small" },
  { theme: "Patience", focus: "letting a slow plan work" },
  { theme: "Discipline", focus: "the boring habit that compounds" },
  { theme: "Generosity", focus: "giving without keeping score" },
  { theme: "Boundaries", focus: "saying no to a soft drain" },
  { theme: "Risk", focus: "a calculated bet, not a gamble" },
  { theme: "Recovery", focus: "rest is a money strategy" },
  { theme: "Negotiation", focus: "asking for what you're worth" },
  { theme: "Audit", focus: "looking at the number you've avoided" },
  { theme: "Celebration", focus: "marking a milestone you earned" },
  { theme: "Simplification", focus: "killing one subscription or rule" },
  { theme: "Learning", focus: "one concept that changes a habit" },
  { theme: "Partnership", focus: "money talk with someone who matters" },
];

/**
 * ISO Monday for a given Date (UTC).
 */
export function isoMonday(d: Date): string {
  const day = d.getUTCDay() === 0 ? 7 : d.getUTCDay();
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - (day - 1));
  return monday.toISOString().slice(0, 10);
}

/**
 * Week index for theme rotation — keyed by week-of-year.
 */
function weekIndex(weekStart: string): number {
  const d = new Date(weekStart + "T00:00:00Z");
  const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const diff = d.getTime() - startOfYear.getTime();
  return Math.floor(diff / (7 * 86_400_000));
}

const HEADLINES: Record<Sign, (theme: string) => string> = {
  aries: (t) => `Aries: charge into ${t.toLowerCase()}, but check the map.`,
  taurus: (t) => `Taurus: ${t.toLowerCase()} suits your slow, sure pace.`,
  gemini: (t) => `Gemini: pick one ${t.toLowerCase()} thread and pull.`,
  cancer: (t) => `Cancer: ${t.toLowerCase()} starts at home.`,
  leo: (t) => `Leo: ${t.toLowerCase()} earns more applause when it's real.`,
  virgo: (t) => `Virgo: your ${t.toLowerCase()} is already on the spreadsheet.`,
  libra: (t) => `Libra: ${t.toLowerCase()} is best when balanced.`,
  scorpio: (t) => `Scorpio: ${t.toLowerCase()} runs deeper than you let on.`,
  sagittarius: (t) => `Sagittarius: ${t.toLowerCase()} is fuel for the next horizon.`,
  capricorn: (t) => `Capricorn: ${t.toLowerCase()} is one more brick.`,
  aquarius: (t) => `Aquarius: your ${t.toLowerCase()} is ahead of the room — wait for them.`,
  pisces: (t) => `Pisces: ${t.toLowerCase()} flows when the structure holds.`,
};

const LUCKY_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function generateWeeklyForecast(args: {
  sign: Sign;
  weekStart: string;
}): WeeklyForecast {
  const idx = weekIndex(args.weekStart);
  const themeData = WEEKLY_THEMES[idx % WEEKLY_THEMES.length];
  const luckyDay =
    LUCKY_DAYS[
      (idx + signIndex(args.sign)) % LUCKY_DAYS.length
    ];

  const body = composeBody(args.sign, themeData);
  const watchOutFor = composeWarning(args.sign, themeData);
  return {
    weekStart: args.weekStart,
    sign: args.sign,
    theme: themeData.theme,
    headline: HEADLINES[args.sign](themeData.theme),
    body,
    luckyDay,
    watchOutFor,
  };
}

function signIndex(s: Sign): number {
  return Object.keys(SIGNS).indexOf(s);
}

function composeBody(sign: Sign, theme: { theme: string; focus: string }): string {
  const meta = SIGNS[sign];
  return [
    `This week's theme is ${theme.theme.toLowerCase()} — focused on ${theme.focus}.`,
    `Your archetype: ${meta.archetype}`,
    `As ${meta.element} sign, your money flows when you ${elementAdvice(meta.element, theme.focus)}.`,
  ].join(" ");
}

function elementAdvice(element: string, focus: string): string {
  switch (element) {
    case "fire":
      return `channel the energy into ${focus} early in the week, before it scatters`;
    case "earth":
      return `build a small structure around ${focus} you can repeat`;
    case "air":
      return `talk it through with one person before you act on ${focus}`;
    case "water":
      return `feel out the timing of ${focus} — your intuition is the signal`;
    default:
      return `lean into ${focus}`;
  }
}

function composeWarning(sign: Sign, theme: { theme: string; focus: string }): string {
  const meta = SIGNS[sign];
  switch (meta.modality) {
    case "cardinal":
      return `Don't start three new things — the theme is ${theme.theme.toLowerCase()}, not stacking.`;
    case "fixed":
      return `Don't dig in if the data changes. The theme is ${theme.theme.toLowerCase()}, not stubbornness.`;
    case "mutable":
      return `Don't drift. Pick a lane this week and stay in it.`;
  }
}
