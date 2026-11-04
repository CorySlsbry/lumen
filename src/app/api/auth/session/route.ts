import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { createSessionCookie } from "@/lib/auth/firebase-admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const Body = z.object({ idToken: z.string().min(10) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const cookie = await createSessionCookie(parsed.data.idToken);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
