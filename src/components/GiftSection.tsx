"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Gift } from "lucide-react";
import { GiftCard } from "@/components/GiftCard";
import { GiftCart } from "@/components/GiftCart";
import type { GiftProduct } from "@/app/api/gifts/route";

type FetchState = "idle" | "loading" | "error";

export function GiftSection() {
  const [gifts, setGifts] = useState<GiftProduct[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("loading");

  useEffect(() => {
    fetch("/api/gifts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<GiftProduct[]>;
      })
      .then((data) => {
        setGifts(data);
        setFetchState("idle");
      })
      .catch(() => setFetchState("error"));
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <Image
        src="/mosaico/mosaico (28).JPG"
        alt=""
        fill
        className="object-cover brightness-[0.15]"
        priority={false}
      />

      <div className="relative z-10 flex flex-col items-center w-full h-full max-w-5xl mx-auto px-4 py-16 gap-8">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <p className="text-xs uppercase tracking-[0.5em] text-white/60 font-light text-center">
            Casamento Danielle & Renan
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-white drop-shadow-md">
            Lista de presentes
          </h2>
          <div className="w-16 h-px bg-white/40 mt-1" />
        </div>

        <div className="w-full flex-1 overflow-y-auto mt-10">
          {fetchState === "loading" && (
            <div className="flex items-center justify-center h-full py-16">
              <div className="flex flex-col items-center gap-3 text-white/50">
                <Gift className="w-8 h-8 animate-pulse" />
                <p className="text-sm">Carregando presentes...</p>
              </div>
            </div>
          )}

          {fetchState === "error" && (
            <div className="flex items-center justify-center h-full py-16">
              <p className="text-sm text-red-300 text-center bg-red-900/30 backdrop-blur-sm rounded-xl px-4 py-2">
                Não foi possível carregar os presentes. Tente novamente.
              </p>
            </div>
          )}

          {fetchState === "idle" && gifts.length === 0 && (
            <div className="flex items-center justify-center h-full py-16">
              <p className="text-sm text-white/40 text-center">
                Nenhum presente disponível no momento.
              </p>
            </div>
          )}

          {fetchState === "idle" && gifts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-24">
              {gifts.map((gift) => (
                <GiftCard key={gift.giftId} gift={gift} />
              ))}
            </div>
          )}
        </div>

        <GiftCart />
      </div>
    </div>
  );
}
