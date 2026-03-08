import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPurchasedProductIds } from "@/firebase/purchases";

export type GiftProduct = {
  productId: string;
  priceId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  unique: boolean;
  purchased: boolean;
};

export async function GET() {
  try {
    const [prices, purchasedIds] = await Promise.all([
      stripe.prices.list({ active: true, expand: ["data.product"], limit: 100 }),
      getPurchasedProductIds(),
    ]);

    const gifts: GiftProduct[] = prices.data
      .filter((price) => {
        const product = price.product;
        return (
          typeof product === "object" &&
          product !== null &&
          !("deleted" in product) &&
          product.active
        );
      })
      .map((price) => {
        const product = price.product as import("stripe").Stripe.Product;
        const isUnique = product.metadata?.unique === "true";
        return {
          productId: product.id,
          priceId: price.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount ?? 0,
          imageUrl: product.images?.[0] ?? null,
          unique: isUnique,
          purchased: isUnique && purchasedIds.has(product.id),
        };
      });

    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}
