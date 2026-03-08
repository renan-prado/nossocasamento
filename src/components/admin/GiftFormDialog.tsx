"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Gift, GiftPayload } from "@/firebase/gifts";

type Props = {
  open: boolean;
  gift: Gift | null;
  onClose: () => void;
  onSubmit: (payload: GiftPayload) => Promise<void>;
};

const defaultForm = {
  name: "",
  description: "",
  priceFormatted: "",
  imageUrl: "",
  unique: false,
};

export function GiftFormDialog({ open, gift, onClose, onSubmit }: Props) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (gift) {
      setForm({
        name: gift.name,
        description: gift.description ?? "",
        priceFormatted: (gift.price / 100).toFixed(2).replace(".", ","),
        imageUrl: gift.imageUrl ?? "",
        unique: gift.unique,
      });
    } else {
      setForm(defaultForm);
    }
  }, [gift, open]);

  function parsePriceToCentavos(value: string): number {
    const normalized = value.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : Math.round(parsed * 100);
  }

  function handlePriceChange(value: string) {
    const digits = value.replace(/[^\d,]/g, "");
    setForm((prev) => ({ ...prev, priceFormatted: digits }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parsePriceToCentavos(form.priceFormatted),
        imageUrl: form.imageUrl.trim() || null,
        unique: form.unique,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const isValid = form.name.trim().length > 0 && parsePriceToCentavos(form.priceFormatted) > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{gift ? "Editar presente" : "Novo presente"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Jogo de panelas"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">
              Descrição
              <span className="ml-1.5 text-[11px] font-normal text-neutral-400">opcional</span>
            </Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Ex: Tramontina 5 peças inox"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Preço (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                R$
              </span>
              <Input
                id="price"
                value={form.priceFormatted}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="pl-9"
                placeholder="0,00"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imageUrl">
              URL da imagem
              <span className="ml-1.5 text-[11px] font-normal text-neutral-400">opcional</span>
            </Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
            <input
              type="checkbox"
              id="unique"
              checked={form.unique}
              onChange={(e) => setForm((prev) => ({ ...prev, unique: e.target.checked }))}
              className="h-4 w-4 rounded border-neutral-300 cursor-pointer"
            />
            <div className="flex flex-col">
              <Label htmlFor="unique" className="cursor-pointer">
                Presente único
              </Label>
              <p className="text-xs text-neutral-400">
                Marcado como esgotado após ser comprado
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !isValid}>
            {saving ? "Salvando..." : gift ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
