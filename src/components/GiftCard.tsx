"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { GiftProduct } from "@/app/api/gifts/route";
import { useCartStore } from "@/store/cart-store";

type Props = {
  gift: GiftProduct;
};

export function GiftCard({ gift }: Props) {
  const { items, addItem, decrementItem } = useCartStore();
  const cartItem = items.find((i) => i.giftId === gift.giftId);
  const quantity = cartItem?.quantity ?? 0;

  const formattedPrice = (gift.price / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border transition-all duration-200 ${
        !gift.available
          ? "border-white/10 opacity-50 grayscale"
          : "border-white/20 hover:border-white/40 hover:bg-white/15"
      }`}
    >
      <div className="relative w-full aspect-square bg-white/5">
        {gift.imageUrl ? (
          <Image
            src={gift.imageUrl}
            alt={gift.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-white/20" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 gap-3 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-white leading-tight line-clamp-2 uppercase">
            {gift.name}
          </p>
          {gift.description && (
            <p className="text-xs text-white/50 line-clamp-2">{gift.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto gap-2">
          <span className="text-sm font-bold text-white/90">{formattedPrice}</span>

          {!gift.available ? (
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              indisponível
            </span>
          ) : (
            quantity === 0 ? (
              <button
                type="button"
                onClick={() => addItem({ giftId: gift.giftId, name: gift.name, price: gift.price, imageUrl: gift.imageUrl })}
                className="flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-white text-neutral-900 hover:bg-white/90 hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                Adicionar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrementItem(gift.giftId)}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold text-white w-4 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => addItem({ giftId: gift.giftId, name: gift.name, price: gift.price, imageUrl: gift.imageUrl })}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-neutral-900 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
