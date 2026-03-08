"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";

export function GiftCart() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, addItem, removeItem, decrementItem, clearCart, totalItems, totalPrice } = useCartStore();

  const count = totalItems();
  const total = totalPrice();

  const formattedTotal = (total / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mercadopago/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            giftId: item.giftId,
            quantity: item.quantity,
          })),
        }),
      });

      if (res.status === 409) {
        setError("Um ou mais presentes já foram comprados. Recarregue a página.");
        return;
      }

      if (!res.ok) {
        setError("Erro ao iniciar pagamento. Tente novamente.");
        return;
      }

      const { url } = await res.json();
      clearCart();
      window.location.href = url;
    } catch {
      setError("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (count === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-xl text-neutral-900 font-semibold text-sm hover:bg-white/95 hover:shadow-2xl active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>
          {count} {count === 1 ? "presente" : "presentes"}
        </span>
        <span className="font-bold">
          {(total / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag className="w-5 h-5" />
              Seus presentes
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.giftId}
                className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-neutral-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate uppercase">{item.name}</p>
                  <p className="text-xs text-neutral-500">
                    {(item.price / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    cada
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => decrementItem(item.giftId)}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold text-neutral-900 w-5 text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => addItem({ giftId: item.giftId, name: item.name, price: item.price, imageUrl: item.imageUrl })}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t px-6 py-5 flex flex-col gap-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Total</span>
              <span className="text-lg font-bold text-neutral-900">{formattedTotal}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-xl bg-neutral-900 text-white py-3 text-sm font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Redirecionando..." : "Finalizar presente"}
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Limpar carrinho
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
