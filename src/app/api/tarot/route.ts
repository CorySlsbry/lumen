import { NextResponse } from "next/server";
import { z } from "zod";
import { drawReading, type SpreadKind } from "@/lib/tarot/reader";
import { getCurrentUser } from "@/lib/auth/session";

const Query = z.object({
  spread: z.enum(["daily_one_card", "three_card_past_present_future"]).default("daily_one_card"),
});

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const parsed = Query.safeParse({ spread: url.searchParams.get("spread") ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: "bad spread" }, { status: 400 });
  const reading = drawReading({
    userId: user.id,
    dateISO: new Date().toISOString().slice(0, 10),
    spread: parsed.data.spread as SpreadKind,
  });
  return NextResponse.json(reading);
}
