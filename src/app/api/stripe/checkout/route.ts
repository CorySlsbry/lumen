import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe/client";
import { PRICING } from "@/lib/stripe/pricing";

const Body = z.object({ plan: z.enum(["monthly", "yearly"]) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const stripe = getStripe();
  const priceId =
    parsed.data.plan === "monthly"
      ? process.env[PRICING.monthly.stripeEnvVar]
      : process.env[PRICING.yearly.stripeEnvVar];

  if (!priceId) {
    return NextResponse.json({ error: "price not configured" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email ?? undefined,
    // The subscription carries the user id so its webhook events can be matched to the account.
    subscription_data: { trial_period_days: 7, metadata: { userId: user.id } },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=ok`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/premium?cancelled=1`,
    allow_promotion_codes: true,
    client_reference_id: user.id,
  });
  return NextResponse.json({ url: session.url });
}
