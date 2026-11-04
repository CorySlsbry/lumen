import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createLinkToken } from "@/lib/roundup/plaid";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const data = await createLinkToken(user.id);
    return NextResponse.json({ link_token: data.link_token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "plaid error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
