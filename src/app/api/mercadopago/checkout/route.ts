import { NextRequest, NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";
import { getPurchasedProductIds } from "@/firebase/purchases";
import { listGifts } from "@/firebase/gifts";

type CheckoutItem = {
  giftId: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CheckoutItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const [purchasedIds, allGifts] = await Promise.all([
      getPurchasedProductIds(),
      listGifts(),
    ]);

    const alreadyPurchased = items.filter((item) => purchasedIds.has(item.giftId));
    if (alreadyPurchased.length > 0) {
      return NextResponse.json(
        { error: "One or more items are no longer available" },
        { status: 409 }
      );
    }

    const giftMap = new Map(allGifts.map((g) => [g.id, g]));

    const lineItems = items.flatMap((item) => {
      const gift = giftMap.get(item.giftId);
      if (!gift) return [];
      return [
        {
          id: gift.id,
          title: gift.name,
          description: gift.description ?? undefined,
          picture_url: gift.imageUrl ?? undefined,
          quantity: item.quantity,
          unit_price: gift.price / 100,
          currency_id: "BRL",
        },
      ];
    });

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid items found" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const isHttps = origin.startsWith("https://");

    const result = await preference.create({
      body: {
        items: lineItems,
        back_urls: {
          success: `${origin}/presentes/sucesso`,
          failure: `${origin}/danielle-e-renan`,
          pending: `${origin}/danielle-e-renan`,
        },
        ...(isHttps && { auto_return: "approved" }),
        notification_url: isHttps ? `${origin}/api/mercadopago/webhook` : undefined,
        metadata: {
          gift_ids: items.map((i) => i.giftId).join(","),
        },
      },
    });

    const url = result.sandbox_init_point ?? result.init_point;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error creating MP preference:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
