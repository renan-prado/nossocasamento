"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, EyeOff, Eye, ImageOff, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Gift,
  type GiftPayload,
  createGift,
  deleteGift,
  listGifts,
  updateGift,
} from "@/firebase/gifts";
import Link from "next/link";
import { GiftDeleteDialog } from "@/components/admin/GiftDeleteDialog";
import { GiftFormDialog } from "@/components/admin/GiftFormDialog";

export function GiftManager() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [deletingGift, setDeletingGift] = useState<Gift | null>(null);

  async function fetchGifts() {
    setLoading(true);
    try {
      const data = await listGifts();
      setGifts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGifts();
  }, []);

  function openNew() {
    setEditingGift(null);
    setFormOpen(true);
  }

  function openEdit(gift: Gift) {
    setEditingGift(gift);
    setFormOpen(true);
  }

  async function handleFormSubmit(payload: GiftPayload) {
    if (editingGift) {
      await updateGift(editingGift.id, payload);
    } else {
      await createGift(payload);
    }
    await fetchGifts();
  }

  async function handleDelete(id: string) {
    await deleteGift(id);
    await fetchGifts();
  }

  async function handleToggleAvailable(gift: Gift) {
    await updateGift(gift.id, { available: !gift.available });
    await fetchGifts();
  }

  const totalValue = gifts.reduce((sum, g) => sum + g.price, 0);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/tchubiraudau"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
              Lista de Presentes
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">Danielle & Renan · 25/06/2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchGifts}
            disabled={loading}
            title="Atualizar lista"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar presente</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="px-4 py-4">
            <p className="text-xs text-neutral-500 font-medium mb-1">Total de presentes</p>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{gifts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <p className="text-xs text-neutral-500 font-medium mb-1">Indisponíveis</p>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {gifts.filter((g) => !g.available).length}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="px-4 py-4">
            <p className="text-xs text-neutral-500 font-medium mb-1">Valor total da lista</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">
              {(totalValue / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">
              Carregando presentes...
            </div>
          ) : gifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-neutral-400">
              <p className="text-sm">Nenhum presente cadastrado.</p>
              <Button variant="outline" size="sm" onClick={openNew}>
                Adicionar o primeiro
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12" />
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gifts.map((gift) => (
                    <TableRow key={gift.id}>
                      <TableCell>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          {gift.imageUrl ? (
                            <Image
                              src={gift.imageUrl}
                              alt={gift.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageOff className="w-4 h-4 text-neutral-300" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{gift.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-neutral-500 text-sm max-w-48 truncate">
                        {gift.description ?? <span className="text-neutral-300">—</span>}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        {(gift.price / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>
                        {gift.available ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Disponível
                          </Badge>
                        ) : (
                          <Badge className="bg-neutral-100 text-neutral-500 hover:bg-neutral-100">
                            Indisponível
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 cursor-pointer ${gift.available ? "text-neutral-500 hover:text-neutral-700" : "text-neutral-400 hover:text-green-600"}`}
                            onClick={() => handleToggleAvailable(gift)}
                            title={gift.available ? "Marcar como indisponível" : "Marcar como disponível"}
                          >
                            {gift.available ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                            onClick={() => openEdit(gift)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-500 hover:text-red-600 cursor-pointer"
                            onClick={() => setDeletingGift(gift)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <GiftFormDialog
        open={formOpen}
        gift={editingGift}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <GiftDeleteDialog
        gift={deletingGift}
        onClose={() => setDeletingGift(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
