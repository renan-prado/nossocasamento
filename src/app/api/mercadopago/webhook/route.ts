import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { markProductAsPurchased } from "@/firebase/purchases";
import { listGifts } from "@/firebase/gifts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ received: true });
    }

    const paymentId = String(body.data.id);
    const result = await payment.get({ id: paymentId });

    if (result.status !== "approved") {
      return NextResponse.json({ received: true });
    }

    const giftIds: string[] =
      (result.metadata?.gift_ids as string | undefined)?.split(",").filter(Boolean) ?? [];

    if (giftIds.length === 0) {
      return NextResponse.json({ received: true });
    }

    const allGifts = await listGifts();
    const giftMap = new Map(allGifts.map((g) => [g.id, g]));

    await Promise.all(
      giftIds
        .filter((id) => giftMap.get(id)?.unique === true)
        .map((id) => markProductAsPurchased(id, paymentId))
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing MP webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
