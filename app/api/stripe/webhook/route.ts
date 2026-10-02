import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Webhook not configured", { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });
  const body = await request.text();
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(body, signature, secret); }
  catch { return new NextResponse("Invalid signature", { status: 400 }); }

  const relevant = ["customer.subscription.created","customer.subscription.updated","customer.subscription.deleted"];
  if (relevant.includes(event.type)) {
    const subscription = event.data.object as Stripe.Subscription;
    const workspaceId = subscription.metadata.workspaceId;
    if (workspaceId) {
      const status = subscription.status;
      const plan = subscription.items.data[0]?.price.nickname || "pro";
      await prisma.subscription.upsert({
        where: { workspaceId },
        update: {
          stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
          stripeSubscriptionId: subscription.id,
          status,
          plan,
          currentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end ? subscription.items.data[0].current_period_end * 1000 : Date.now()),
        },
        create: {
          workspaceId,
          stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
          stripeSubscriptionId: subscription.id,
          status,
          plan,
        },
      });
      await prisma.workspace.update({ where: { id: workspaceId }, data: { plan: status === "active" || status === "trialing" ? plan : "free" } });
    }
  }
  return NextResponse.json({ received: true });
}
