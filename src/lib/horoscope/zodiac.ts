/**
 * Sun-sign assignment from birth date.
 *
 * Accurate to the tropical zodiac boundaries used by Western astrology.
 * Moon sign + rising sign require an ephemeris (deferred — see horoscope/ephemeris.ts).
 */

export type Sign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

type SignMeta = {
  id: Sign;
  label: string;
  glyph: string;
  element: "fire" | "earth" | "air" | "water";
  modality: "cardinal" | "fixed" | "mutable";
  /** Finance-archetype one-liner used in copy. */
  archetype: string;
};

export const SIGNS: Record<Sign, SignMeta> = {
  aries: {
    id: "aries",
    label: "Aries",
    glyph: "♈",
    element: "fire",
    modality: "cardinal",
    archetype: "The starter — moves first, asks later.",
  },
  taurus: {
    id: "taurus",
    label: "Taurus",
    glyph: "♉",
    element: "earth",
    modality: "fixed",
    archetype: "The builder — slow, deliberate, compounding.",
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    glyph: "♊",
    element: "air",
    modality: "mutable",
    archetype: "The connector — many income streams, many ideas.",
  },
  cancer: {
    id: "cancer",
    label: "Cancer",
    glyph: "♋",
    element: "water",
    modality: "cardinal",
    archetype: "The protector — saves for the family before the self.",
  },
  leo: {
    id: "leo",
    label: "Leo",
    glyph: "♌",
    element: "fire",
    modality: "fixed",
    archetype: "The performer — earns big, spends bigger, must learn to keep.",
  },
  virgo: {
    id: "virgo",
    label: "Virgo",
    glyph: "♍",
    element: "earth",
    modality: "mutable",
    archetype: "The optimizer — perfect spreadsheet, must remember to live.",
  },
  libra: {
    id: "libra",
    label: "Libra",
    glyph: "♎",
    element: "air",
    modality: "cardinal",
    archetype: "The balancer — fair to everyone except sometimes themselves.",
  },
  scorpio: {
    id: "scorpio",
    label: "Scorpio",
    glyph: "♏",
    element: "water",
    modality: "fixed",
    archetype: "The strategist — deep research, long bets, quiet wealth.",
  },
  sagittarius: {
    id: "sagittarius",
    label: "Sagittarius",
    glyph: "♐",
    element: "fire",
    modality: "mutable",
    archetype: "The explorer — earns to travel, must invest before adventuring.",
  },
  capricorn: {
    id: "capricorn",
    label: "Capricorn",
    glyph: "♑",
    element: "earth",
    modality: "cardinal",
    archetype: "The architect — long-term plans, late-life wealth.",
  },
  aquarius: {
    id: "aquarius",
    label: "Aquarius",
    glyph: "♒",
    element: "air",
    modality: "fixed",
    archetype: "The futurist — unconventional plays, ahead-of-curve thinking.",
  },
  pisces: {
    id: "pisces",
    label: "Pisces",
    glyph: "♓",
    element: "water",
    modality: "mutable",
    archetype: "The dreamer — needs structure to hold the vision.",
  },
};

/**
 * Tropical sun sign from a birth date (YYYY-MM-DD).
 * Standard western astrology cutoffs.
 */
export function sunSign(birthDateISO: string): Sign {
  const [, mStr, dStr] = birthDateISO.split("-");
  const m = Number(mStr);
  const d = Number(dStr);
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "taurus";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "gemini";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "scorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "sagittarius";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "capricorn";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "aquarius";
  return "pisces";
}
