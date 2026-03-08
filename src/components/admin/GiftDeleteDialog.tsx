"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Gift } from "@/firebase/gifts";

type Props = {
  gift: Gift | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
};

export function GiftDeleteDialog({ gift, onClose, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!gift) return;
    setDeleting(true);
    try {
      await onConfirm(gift.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={!!gift} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover presente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover{" "}
            <span className="font-semibold text-neutral-900">{gift?.name}</span>? Essa ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={deleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleting ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
