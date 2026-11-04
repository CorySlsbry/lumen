import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { exchangePublicToken } from "@/lib/roundup/plaid";
import { db } from "@/lib/db/client";
import { linkedAccounts } from "@/lib/db/schema";
import { newId, type LinkedAccountId } from "@/lib/db/ids";

const Body = z.object({
  public_token: z.string().min(10),
  institution_name: z.string(),
  account: z.object({
    id: z.string(),
    name: z.string(),
    mask: z.string().nullable().optional(),
    type: z.string(),
    subtype: z.string().nullable().optional(),
  }),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { public_token, institution_name, account } = parsed.data;

  const exchange = await exchangePublicToken(public_token);
  await db.insert(linkedAccounts).values({
    id: newId<LinkedAccountId>(),
    userId: user.id,
    plaidItemId: exchange.item_id,
    plaidAccessToken: exchange.access_token, // TODO: encrypt at rest via KMS
    plaidAccountId: account.id,
    institutionName: institution_name,
    accountName: account.name,
    accountMask: account.mask ?? null,
    accountType: account.type,
    accountSubtype: account.subtype ?? null,
  });
  return NextResponse.json({ ok: true });
}
