import { NextResponse } from "next/server";
import { listGifts } from "@/firebase/gifts";

export type GiftProduct = {
  giftId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export async function GET() {
  try {
    const gifts = await listGifts();

    const products: GiftProduct[] = gifts.map((gift) => ({
      giftId: gift.id,
      name: gift.name,
      description: gift.description,
      price: gift.price,
      imageUrl: gift.imageUrl,
      available: gift.available,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}
