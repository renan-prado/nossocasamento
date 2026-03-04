"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Guest,
  type GuestPayload,
  createGuest,
  deleteGuest,
  listGuests,
  updateGuest,
} from "@/firebase/guests";
import { GuestDeleteDialog } from "@/components/admin/GuestDeleteDialog";
import { GuestFormDialog } from "@/components/admin/GuestFormDialog";

type SortField = "name" | "familyName" | "status";
type SortDir = "asc" | "desc";

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  accepted: "Confirmado",
  declined: "Recusado",
};

function StatusBadge({ status }: { status: string }) {
  if (status === "accepted") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmado</Badge>;
  }
  if (status === "declined") {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Recusado</Badge>;
  }
  return <Badge variant="secondary">Pendente</Badge>;
}

export function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);

  async function fetchGuests() {
    setLoading(true);
    try {
      const data = await listGuests();
      setGuests(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGuests();
  }, []);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    return [...guests].sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      const cmp = av.localeCompare(bv, "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [guests, sortField, sortDir]);

  const stats = useMemo(
    () => ({
      total: guests.length,
      accepted: guests.filter((g) => g.status === "accepted").length,
      declined: guests.filter((g) => g.status === "declined").length,
      pending: guests.filter((g) => g.status === "pending").length,
    }),
    [guests],
  );

  function openNew() {
    setEditingGuest(null);
    setFormOpen(true);
  }

  function openEdit(guest: Guest) {
    setEditingGuest(guest);
    setFormOpen(true);
  }

  async function handleFormSubmit(payload: GuestPayload) {
    if (editingGuest) {
      await updateGuest(editingGuest.id, payload);
    } else {
      await createGuest(payload);
    }
    await fetchGuests();
  }

  async function handleDelete(id: string) {
    await deleteGuest(id);
    await fetchGuests();
  }

  function SortHeader({ field, children }: { field: SortField; children: React.ReactNode }) {
    return (
      <TableHead
        className="cursor-pointer select-none whitespace-nowrap"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <ArrowUpDown
            className={`h-3.5 w-3.5 ${sortField === field ? "text-neutral-900" : "text-neutral-400"}`}
          />
        </div>
      </TableHead>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gerenciamento de Convidados</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Danielle & Renan · 25/06/2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchGuests}
            disabled={loading}
            title="Atualizar lista"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar convidado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{stats.accepted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Recusados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-400">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">
              Carregando convidados...
            </div>
          ) : guests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-neutral-400">
              <p className="text-sm">Nenhum convidado cadastrado.</p>
              <Button variant="outline" size="sm" onClick={openNew}>
                Adicionar o primeiro
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortHeader field="name">Nome</SortHeader>
                  <TableHead>Busca</TableHead>
                  <SortHeader field="familyName">Família</SortHeader>
                  <SortHeader field="status">Status</SortHeader>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{guest.searchName}</TableCell>
                    <TableCell className="text-neutral-700">{guest.familyName}</TableCell>
                    <TableCell>
                      <StatusBadge status={guest.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                          onClick={() => openEdit(guest)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-500 hover:text-red-600 cursor-pointer"
                          onClick={() => setDeletingGuest(guest)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <GuestFormDialog
        open={formOpen}
        guest={editingGuest}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <GuestDeleteDialog
        guest={deletingGuest}
        onClose={() => setDeletingGuest(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
