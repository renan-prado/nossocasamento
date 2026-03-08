import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markProductAsPurchased } from "@/firebase/purchases";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productIds = session.metadata?.productIds?.split(",").filter(Boolean) ?? [];

    if (productIds.length === 0) {
      return NextResponse.json({ received: true });
    }

    const products = await Promise.all(
      productIds.map((id) => stripe.products.retrieve(id))
    );

    await Promise.all(
      products
        .filter((product) => product.metadata?.unique === "true")
        .map((product) => markProductAsPurchased(product.id, session.id))
    );
  }

  return NextResponse.json({ received: true });
}
