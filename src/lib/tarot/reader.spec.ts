import { describe, expect, test } from "vitest";
import { drawReading } from "./reader";
import { DECK } from "./deck";

describe("drawReading", () => {
  test("deck has exactly 78 cards", () => {
    expect(DECK.length).toBe(78);
  });

  test("daily pull returns exactly one card", () => {
    const r = drawReading({
      userId: "u1",
      dateISO: "2026-05-11",
      spread: "daily_one_card",
    });
    expect(r.cards.length).toBe(1);
    expect(r.cards[0].position).toBe("today");
  });

  test("three-card spread returns past/present/future", () => {
    const r = drawReading({
      userId: "u1",
      dateISO: "2026-05-11",
      spread: "three_card_past_present_future",
    });
    expect(r.cards.map((c) => c.position)).toEqual(["past", "present", "future"]);
  });

  test("same user + same day = same reading (deterministic)", () => {
    const a = drawReading({
      userId: "u1",
      dateISO: "2026-05-11",
      spread: "daily_one_card",
    });
    const b = drawReading({
      userId: "u1",
      dateISO: "2026-05-11",
      spread: "daily_one_card",
    });
    expect(a.cards[0].card.id).toBe(b.cards[0].card.id);
    expect(a.cards[0].reversed).toBe(b.cards[0].reversed);
  });

  test("different days give different readings", () => {
    const a = drawReading({
      userId: "u1",
      dateISO: "2026-05-11",
      spread: "daily_one_card",
    });
    const b = drawReading({
      userId: "u1",
      dateISO: "2026-05-12",
      spread: "daily_one_card",
    });
    // Could rarely collide; we assert at least one field differs
    const differ =
      a.cards[0].card.id !== b.cards[0].card.id ||
      a.cards[0].reversed !== b.cards[0].reversed;
    expect(differ).toBe(true);
  });

  test("three-card spread has no duplicate cards", () => {
    const r = drawReading({
      userId: "u2",
      dateISO: "2026-05-11",
      spread: "three_card_past_present_future",
    });
    const ids = r.cards.map((c) => c.card.id);
    expect(new Set(ids).size).toBe(3);
  });
});
