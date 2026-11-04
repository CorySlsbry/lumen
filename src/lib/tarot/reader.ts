/**
 * Tarot reader — deterministic pulls from a seeded RNG.
 *
 * The seed is `${userId}-${dateISO}-${spreadKind}` so the same user gets the
 * same card for the same day. Re-renders are idempotent. No LLM calls.
 */

import { DECK, type TarotCard } from "./deck";

export type SpreadKind = "daily_one_card" | "three_card_past_present_future";

export type DrawnCard = {
  position: string;
  card: TarotCard;
  reversed: boolean;
};

export type Reading = {
  seed: string;
  spread: SpreadKind;
  cards: DrawnCard[];
  /** Synthesis copy generated deterministically from the cards. */
  synthesis: string;
};

/* -------------------------------------------------------------------------- */
/*  Seeded PRNG (mulberry32)                                                  */
/* -------------------------------------------------------------------------- */

function hashStringToSeed(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/*  Pulls                                                                     */
/* -------------------------------------------------------------------------- */

export function drawReading(args: {
  userId: string;
  dateISO: string; // YYYY-MM-DD
  spread: SpreadKind;
}): Reading {
  const seed = `${args.userId}-${args.dateISO}-${args.spread}`;
  const rng = mulberry32(hashStringToSeed(seed));
  const positions = positionsFor(args.spread);

  // Sample without replacement
  const pool = [...DECK];
  const cards: DrawnCard[] = [];
  for (const position of positions) {
    const idx = Math.floor(rng() * pool.length);
    const [card] = pool.splice(idx, 1);
    const reversed = rng() < 0.33; // ~1/3 reversed
    cards.push({ position, card, reversed });
  }

  return {
    seed,
    spread: args.spread,
    cards,
    synthesis: synthesize(cards, args.spread),
  };
}

function positionsFor(spread: SpreadKind): string[] {
  switch (spread) {
    case "daily_one_card":
      return ["today"];
    case "three_card_past_present_future":
      return ["past", "present", "future"];
  }
}

function synthesize(cards: DrawnCard[], spread: SpreadKind): string {
  if (spread === "daily_one_card") {
    const c = cards[0];
    const text = c.reversed ? c.card.reversed : c.card.upright;
    return text;
  }
  // Three-card: chain past/present/future
  const lines = cards.map((c) => {
    const text = c.reversed ? c.card.reversed : c.card.upright;
    return `${capitalize(c.position)}: ${text}`;
  });
  return lines.join("\n\n");
}

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}
