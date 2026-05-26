"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpDown, Check, RefreshCw, X, Minus } from "lucide-react";
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
  type GuestStatus,
  type GuestType,
  listGuests,
  updateGuestSecondConfirmation,
} from "@/firebase/guests";

type SortField = "name" | "familyName" | "type" | "secondConfirmation";
type SortDir = "asc" | "desc";

const TYPE_BADGE_STYLE: Record<GuestType, string> = {
  full: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  half: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  supplier: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  exempt: "bg-neutral-100 text-neutral-600 hover:bg-neutral-100",
};

function SecondConfirmationBadge({ status }: { status: GuestStatus }) {
  if (status === "accepted") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmado</Badge>;
  }
  if (status === "declined") {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Recusado</Badge>;
  }
  return <Badge className="bg-neutral-100 text-neutral-600 hover:bg-neutral-100">Pendente</Badge>;
}

export function GuestSecondConfirmation() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  async function fetchGuests() {
    setLoading(true);
    try {
      const data = await listGuests();
      setGuests(data.filter((g) => g.status === "accepted"));
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
      const cmp = String(av).localeCompare(String(bv), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [guests, sortField, sortDir]);

  const stats = useMemo(() => {
    const accepted = guests.filter((g) => g.secondConfirmation === "accepted");
    const declined = guests.filter((g) => g.secondConfirmation === "declined");
    const pending = guests.filter((g) => g.secondConfirmation === "pending");
    const weighted = (list: typeof guests) =>
      list.reduce((sum, g) => sum + GUEST_TYPE_WEIGHT[g.type ?? "full"], 0);
    return {
      totalPessoas: guests.length,
      totalConvidados: weighted(guests),
      acceptedPessoas: accepted.length,
      acceptedConvidados: weighted(accepted),
      declinedPessoas: declined.length,
      pendingPessoas: pending.length,
    };
  }, [guests]);

  async function setStatus(guest: Guest, status: GuestStatus) {
    setUpdatingId(guest.id);
    try {
      await updateGuestSecondConfirmation(guest.id, status);
      setGuests((list) =>
        list.map((g) => (g.id === guest.id ? { ...g, secondConfirmation: status } : g)),
      );
    } finally {
      setUpdatingId(null);
    }
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
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/tchubiraudau"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
              Segunda Confirmação
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Reconfirmação dos convidados que já aceitaram no RSVP
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchGuests}
          disabled={loading}
          title="Atualizar lista"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">
              Elegíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stats.totalPessoas}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {stats.totalConvidados % 1 === 0
                ? stats.totalConvidados
                : stats.totalConvidados.toFixed(1)}{" "}
              conv.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">
              Reconfirmados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-green-700">{stats.acceptedPessoas}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {stats.acceptedConvidados % 1 === 0
                ? stats.acceptedConvidados
                : stats.acceptedConvidados.toFixed(1)}{" "}
              conv.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">
              Recusados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.declinedPessoas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-4 pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-neutral-500">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-400">
              {stats.pendingPessoas}
            </p>
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
              <p className="text-sm">Nenhum convidado confirmado no RSVP até o momento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortHeader field="name">Nome</SortHeader>
                    <SortHeader field="familyName">Família</SortHeader>
                    <SortHeader field="type">Tipo</SortHeader>
                    <SortHeader field="secondConfirmation">2ª Confirmação</SortHeader>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((guest) => {
                    const isUpdating = updatingId === guest.id;
                    return (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell className="text-neutral-700 text-sm">
                          {guest.familyName}
                        </TableCell>
                        <TableCell>
                          <Badge className={TYPE_BADGE_STYLE[guest.type ?? "full"]}>
                            {GUEST_TYPE_LABELS[guest.type ?? "full"]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <SecondConfirmationBadge status={guest.secondConfirmation} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-500 hover:text-green-700 hover:bg-green-50 cursor-pointer disabled:opacity-50"
                              onClick={() => setStatus(guest, "accepted")}
                              disabled={isUpdating || guest.secondConfirmation === "accepted"}
                              title="Marcar como confirmado"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-500 hover:text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50"
                              onClick={() => setStatus(guest, "declined")}
                              disabled={isUpdating || guest.secondConfirmation === "declined"}
                              title="Marcar como recusado"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer disabled:opacity-50"
                              onClick={() => setStatus(guest, "pending")}
                              disabled={isUpdating || guest.secondConfirmation === "pending"}
                              title="Voltar para pendente"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
