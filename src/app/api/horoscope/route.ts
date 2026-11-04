import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sunSign } from "@/lib/horoscope/zodiac";
import { generateWeeklyForecast, isoMonday } from "@/lib/horoscope/forecast";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!row?.birthDate) {
    return NextResponse.json({ error: "birth_date_required" }, { status: 400 });
  }
  const forecast = generateWeeklyForecast({
    sign: sunSign(row.birthDate),
    weekStart: isoMonday(new Date()),
  });
  return NextResponse.json(forecast);
}
