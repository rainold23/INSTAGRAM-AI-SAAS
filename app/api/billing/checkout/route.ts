import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id }, include: { workspace: true } });
  if (!membership) return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!priceId || !appUrl) return NextResponse.json({ error: "Billing no está configurado." }, { status: 503 });
  const stripe = getStripe();
  const existing = await prisma.subscription.findUnique({ where: { workspaceId: membership.workspaceId } });
  let customerId = existing?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: session.user.email, name: session.user.name ?? undefined, metadata: { workspaceId: membership.workspaceId } });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { workspaceId: membership.workspaceId },
      update: { stripeCustomerId: customerId },
      create: { workspaceId: membership.workspaceId, stripeCustomerId: customerId },
    });
  }
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: appUrl + "/billing?success=1",
    cancel_url: appUrl + "/billing?canceled=1",
    subscription_data: { metadata: { workspaceId: membership.workspaceId } },
    allow_promotion_codes: true,
  });
  return NextResponse.json({ url: checkout.url });
}
