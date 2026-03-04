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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Guest,
  type GuestPayload,
  type GuestStatus,
  normalizeSearchName,
} from "@/firebase/guests";

type Props = {
  open: boolean;
  guest: Guest | null;
  onClose: () => void;
  onSubmit: (payload: GuestPayload) => Promise<void>;
};

const defaultForm: GuestPayload = {
  name: "",
  searchName: "",
  familyName: "",
  status: "pending",
};

export function GuestFormDialog({ open, guest, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<GuestPayload>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (guest) {
      setForm({
        name: guest.name,
        searchName: guest.searchName,
        familyName: guest.familyName,
        status: guest.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [guest, open]);

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      searchName: normalizeSearchName(value),
    }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.familyName.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{guest ? "Editar convidado" : "Novo convidado"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="searchName">Nome para busca</Label>
            <Input
              id="searchName"
              value={form.searchName}
              onChange={(e) => setForm((prev) => ({ ...prev, searchName: e.target.value }))}
              placeholder="Ex: joao da silva"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="familyName">Família</Label>
            <Input
              id="familyName"
              value={form.familyName}
              onChange={(e) => setForm((prev) => ({ ...prev, familyName: e.target.value }))}
              placeholder="Ex: flores_prado"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((prev) => ({ ...prev, status: v as GuestStatus }))}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="accepted">Confirmado</SelectItem>
                <SelectItem value="declined">Recusado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !form.name.trim() || !form.familyName.trim()}>
            {saving ? "Salvando..." : guest ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
