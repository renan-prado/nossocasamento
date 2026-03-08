import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPurchasedProductIds } from "@/firebase/purchases";

type CheckoutItem = {
  priceId: string;
  productId: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CheckoutItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const purchasedIds = await getPurchasedProductIds();
    const alreadyPurchased = items.filter((item) => purchasedIds.has(item.productId));
    if (alreadyPurchased.length > 0) {
      return NextResponse.json(
        { error: "One or more items are no longer available" },
        { status: 409 }
      );
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      success_url: `${origin}/presentes/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/danielle-e-renan`,
      metadata: {
        productIds: items.map((i) => i.productId).join(","),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
