import { NextResponse } from "next/server";
import { listGifts } from "@/firebase/gifts";
import { getPurchasedProductIds } from "@/firebase/purchases";

export type GiftProduct = {
  giftId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  unique: boolean;
  purchased: boolean;
};

export async function GET() {
  try {
    const [gifts, purchasedIds] = await Promise.all([
      listGifts(),
      getPurchasedProductIds(),
    ]);

    const products: GiftProduct[] = gifts.map((gift) => ({
      giftId: gift.id,
      name: gift.name,
      description: gift.description,
      price: gift.price,
      imageUrl: gift.imageUrl,
      unique: gift.unique,
      purchased: gift.unique && purchasedIds.has(gift.id),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}
