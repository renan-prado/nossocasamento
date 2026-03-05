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
  GUEST_TYPE_LABELS,
  GUEST_TYPE_WEIGHT,
  type Guest,
  type GuestPayload,
  type GuestType,
  createGuest,
  deleteGuest,
  listGuests,
  updateGuest,
} from "@/firebase/guests";
import { GuestDeleteDialog } from "@/components/admin/GuestDeleteDialog";
import { GuestFormDialog } from "@/components/admin/GuestFormDialog";

type SortField = "name" | "familyName" | "status" | "simulado" | "type";
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
  return <Badge className="bg-neutral-100 text-neutral-600 hover:bg-neutral-100">Pendente</Badge>;
}

const TYPE_BADGE_STYLE: Record<GuestType, string> = {
  full: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  half: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  supplier: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  exempt: "bg-neutral-100 text-neutral-600 hover:bg-neutral-100",
};

function SimuladoBadge({ status }: { status: string }) {
  if (status === "accepted") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmado</Badge>;
  }
  if (status === "declined") {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Não vai</Badge>;
  }
  return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Dúvida</Badge>;
}

function TypeBadge({ type }: { type: GuestType }) {
  return (
    <Badge className={TYPE_BADGE_STYLE[type]}>
      {GUEST_TYPE_LABELS[type]}
    </Badge>
  );
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

  const stats = useMemo(() => {
    const accepted = guests.filter((g) => g.status === "accepted");
    const simuladoAccepted = guests.filter((g) => g.simulado === "accepted");
    const simuladoDeclined = guests.filter((g) => g.simulado === "declined");
    const weighted = (list: typeof guests) =>
      list.reduce((sum, g) => sum + GUEST_TYPE_WEIGHT[g.type ?? "full"], 0);

    return {
      pessoas: guests.length,
      convidados: weighted(guests),
      acceptedPessoas: accepted.length,
      acceptedConvidados: weighted(accepted),
      declined: guests.filter((g) => g.status === "declined").length,
      pending: guests.filter((g) => g.status === "pending").length,
      simulado: {
        acceptedPessoas: simuladoAccepted.length,
        acceptedConvidados: weighted(simuladoAccepted),
        declinedPessoas: simuladoDeclined.length,
        declinedConvidados: weighted(simuladoDeclined),
      },
      byType: {
        full: guests.filter((g) => (g.type ?? "full") === "full").length,
        half: guests.filter((g) => g.type === "half").length,
        supplier: guests.filter((g) => g.type === "supplier").length,
        exempt: guests.filter((g) => g.type === "exempt").length,
      },
    };
  }, [guests]);

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
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
            Gerenciamento de Convidados
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Danielle & Renan · 25/06/2026</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
            <span className="hidden sm:inline">Adicionar convidado</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">Pessoas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stats.pessoas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">Convidados</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {stats.convidados % 1 === 0 ? stats.convidados : stats.convidados.toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">Pessoas confirmadas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-green-700">{stats.acceptedPessoas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">Convidados confirmados</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-green-700">
              {stats.acceptedConvidados % 1 === 0 ? stats.acceptedConvidados : stats.acceptedConvidados.toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">Recusados</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.declined}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-400">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardContent className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-xs font-medium text-neutral-500 shrink-0">Por tipo</span>
              {(
                [
                  { key: "full", color: "text-blue-700", dot: "bg-blue-500" },
                  { key: "half", color: "text-amber-700", dot: "bg-amber-500" },
                  { key: "supplier", color: "text-purple-700", dot: "bg-purple-500" },
                  { key: "exempt", color: "text-neutral-500", dot: "bg-neutral-400" },
                ] as const
              ).map(({ key, color, dot }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${dot}`} />
                  <span className="text-xs text-neutral-500">{GUEST_TYPE_LABELS[key]}</span>
                  <span className={`text-sm font-bold ${color}`}>{stats.byType[key]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-xs font-medium text-neutral-500 shrink-0">Simulado</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0 bg-green-500" />
                <span className="text-xs text-neutral-500">Confirmados</span>
                <span className="text-sm font-bold text-green-700">{stats.simulado.acceptedPessoas}</span>
                <span className="text-xs text-neutral-400">
                  ({stats.simulado.acceptedConvidados % 1 === 0
                    ? stats.simulado.acceptedConvidados
                    : stats.simulado.acceptedConvidados.toFixed(1)} conv.)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0 bg-red-400" />
                <span className="text-xs text-neutral-500">Recusados</span>
                <span className="text-sm font-bold text-red-600">{stats.simulado.declinedPessoas}</span>
                <span className="text-xs text-neutral-400">
                  ({stats.simulado.declinedConvidados % 1 === 0
                    ? stats.simulado.declinedConvidados
                    : stats.simulado.declinedConvidados.toFixed(1)} conv.)
                </span>
              </div>
            </div>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortHeader field="name">Nome</SortHeader>
                    <TableHead className="hidden md:table-cell">Busca</TableHead>
                    <SortHeader field="familyName">Família</SortHeader>
                    <SortHeader field="type">Tipo</SortHeader>
                    <SortHeader field="status">Status</SortHeader>
                    <SortHeader field="simulado">Simulado</SortHeader>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-neutral-500 text-sm">
                        {guest.searchName}
                      </TableCell>
                      <TableCell className="text-neutral-700 text-sm">{guest.familyName}</TableCell>
                      <TableCell>
                        <TypeBadge type={guest.type ?? "full"} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={guest.status} />
                      </TableCell>
                      <TableCell>
                        <SimuladoBadge status={guest.simulado} />
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
            </div>
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
