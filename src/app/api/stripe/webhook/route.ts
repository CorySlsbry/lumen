import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { db } from "@/lib/db/client";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  if (!sig) return new NextResponse("no sig", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "bad signature";
    return new NextResponse(message, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      // Set at checkout via subscription_data.metadata (subscriptions have no client_reference_id).
      const userId = sub.metadata?.userId;
      if (!userId) break;
      await db
        .insert(subscriptions)
        .values({
          userId,
          status: sub.status as never,
          stripeCustomerId: typeof sub.customer === "string" ? sub.customer : null,
          stripeSubscriptionId: sub.id,
          priceId: sub.items.data[0]?.price?.id ?? null,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            status: sub.status as never,
            stripeSubscriptionId: sub.id,
            priceId: sub.items.data[0]?.price?.id ?? null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            updatedAt: new Date(),
          },
        });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await db
        .update(subscriptions)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      break;
    }
  }
  return NextResponse.json({ received: true });
}
