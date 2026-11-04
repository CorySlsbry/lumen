/**
 * Astronomical ephemeris adapter.
 *
 * Phase 1: Returns sun-sign-based output only. Moon and rising signs are
 * advertised as "Premium full chart" but the actual planetary positions are
 * computed by a real ephemeris library (`swisseph`).
 *
 * `swisseph` requires native bindings and ephemeris data files. We isolate it
 * here so a future migration to `astronomy-engine` (pure JS) or a Cloud Run
 * sidecar is a single-file change.
 *
 * For now, the function is a stub that returns `null` for non-sun positions —
 * the UI gracefully degrades to sun-sign output.
 */

import { sunSign, type Sign } from "./zodiac";

export type BirthChart = {
  sun: Sign;
  moon: Sign | null;
  rising: Sign | null;
};

export async function computeBirthChart(args: {
  birthDateISO: string;
  birthTimeISO?: string;
  latitude?: number;
  longitude?: number;
}): Promise<BirthChart> {
  const sun = sunSign(args.birthDateISO);
  // TODO Phase 2: wire swisseph for moon + rising.
  // const swe = await import("swisseph");
  // ... actual ephemeris calls ...
  return { sun, moon: null, rising: null };
}
