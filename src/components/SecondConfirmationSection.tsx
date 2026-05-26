"use client";

import { FormEvent, useMemo, useState } from "react";
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { getFirestoreDb } from "@/firebase/client";
import { useToastStore } from "@/store/toast-store";
import { Check, Search, X } from "lucide-react";

type GuestStatus = "pending" | "accepted" | "declined";

type Guest = {
  id: string;
  name: string;
  familyName: string;
  status: GuestStatus;
  secondConfirmation: GuestStatus;
};

type FetchState = "idle" | "loading" | "error" | "not-found" | "not-accepted";

export function SecondConfirmationSection() {
  const [typedName, setTypedName] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedFamilyName, setSelectedFamilyName] = useState<string | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const db = useMemo(() => getFirestoreDb(), []);

  async function handleSearch(e?: FormEvent) {
    if (e) e.preventDefault();
    const trimmed = typedName.trim();
    if (!trimmed) return;

    setFetchState("loading");
    setErrorMessage(null);
    setSelectedFamilyName(null);
    setGuests([]);

    try {
      const guestsRef = collection(db, "guests");
      const normalized = trimmed.toLowerCase();
      const q = query(guestsRef, where("searchName", "==", normalized));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setFetchState("not-found");
        return;
      }
      const firstDoc = snapshot.docs[0];
      const familyName = firstDoc.get("familyName") as string;
      const familyQuery = query(guestsRef, where("familyName", "==", familyName));
      const familySnapshot = await getDocs(familyQuery);
      const familyGuests: Guest[] = familySnapshot.docs
        .map((d) => ({
          id: d.id,
          name: d.get("name") as string,
          familyName: d.get("familyName") as string,
          status: (d.get("status") as GuestStatus) ?? "pending",
          secondConfirmation: (d.get("secondConfirmation") as GuestStatus) ?? "pending",
        }))
        .filter((g) => g.status === "accepted");

      if (familyGuests.length === 0) {
        setFetchState("not-accepted");
        return;
      }

      setGuests(familyGuests);
      setSelectedFamilyName(familyName);
      setFetchState("idle");
    } catch {
      setFetchState("error");
      setErrorMessage("Não foi possível carregar os convidados. Tente novamente.");
    }
  }

  async function handleUpdateStatus(guest: Guest, status: GuestStatus) {
    const nextStatus: GuestStatus =
      guest.secondConfirmation === status ? "pending" : status;

    setSavingId(guest.id);
    setErrorMessage(null);
    try {
      const guestRef = doc(db, "guests", guest.id);
      await updateDoc(guestRef, {
        secondConfirmation: nextStatus,
        secondConfirmationUpdatedAt: serverTimestamp(),
      });
      setGuests((current) =>
        current.map((g) =>
          g.id === guest.id ? { ...g, secondConfirmation: nextStatus } : g,
        ),
      );
      if (nextStatus !== "pending") {
        const actionText =
          nextStatus === "accepted"
            ? "reconfirmou presença!"
            : "não poderá mais comparecer...";
        showToast({
          type: nextStatus === "accepted" ? "success" : "error",
          message: `${guest.name} ${actionText}`,
        });
      }
    } catch {
      setErrorMessage("Não foi possível salvar sua reconfirmação. Tente novamente.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="relative z-10 flex flex-col items-center gap-8 max-w-xl w-full px-4">
      <div className="flex flex-col items-center gap-3">
        <p className="text-[11px] uppercase tracking-[0.4em] text-bege/80 font-light text-center">
          Reta final · 25 de junho
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl text-bege text-center leading-tight italic">
          Última confirmação
        </h2>
        <p className="text-sm sm:text-base text-bege/80 text-center max-w-md font-light leading-relaxed">
          Para fecharmos os últimos detalhes com o buffet, busque o seu nome para revalidar sua presença
        </p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-bege/50 pointer-events-none" />
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full rounded-full border border-bege/30 bg-black/30 backdrop-blur-sm pl-11 pr-32 py-3.5 text-sm text-bege outline-none placeholder:text-bege/40 focus:border-bege/70 transition-colors"
          />
          <button
            type="submit"
            disabled={fetchState === "loading"}
            className="absolute right-1.5 rounded-full bg-bege text-green px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:bg-bege/90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {fetchState === "loading" ? "..." : "Buscar"}
          </button>
        </div>
      </form>

      {fetchState === "not-found" && (
        <p className="text-sm text-red-200 text-center bg-red-950/40 backdrop-blur-sm rounded-full px-5 py-2 border border-red-300/20">
          Não encontramos seu nome. Verifique a digitação.
        </p>
      )}

      {fetchState === "not-accepted" && (
        <p className="text-sm text-bege/90 text-center bg-black/40 backdrop-blur-sm rounded-2xl px-5 py-3 border border-bege/20 max-w-md">
          Nome não encontrado! Caso haja algum engano, entre em contato com os noivos.
        </p>
      )}

      {fetchState === "error" && errorMessage && (
        <p className="text-sm text-red-200 text-center bg-red-950/40 backdrop-blur-sm rounded-full px-5 py-2 border border-red-300/20">
          {errorMessage}
        </p>
      )}

      {selectedFamilyName && guests.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-bege/20" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-bege/70">
              Família {selectedFamilyName}
            </p>
            <div className="flex-1 h-px bg-bege/20" />
          </div>

          <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {guests.map((guest) => {
              const isAccepted = guest.secondConfirmation === "accepted";
              const isDeclined = guest.secondConfirmation === "declined";
              const isSaving = savingId === guest.id;
              return (
                <div
                  key={guest.id}
                  className="rounded-2xl bg-bege/95 backdrop-blur-sm shadow-lg p-4 flex flex-col gap-3 border border-bege/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-serif text-lg text-green font-bold leading-tight">
                        {guest.name}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-green/60">
                        {isAccepted && "Reconfirmado"}
                        {isDeclined && "Não poderá vir"}
                        {!isAccepted && !isDeclined && "Aguardando reconfirmação"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(guest, "accepted")}
                      disabled={isSaving}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isAccepted
                        ? "bg-green text-bege shadow-md"
                        : "bg-transparent text-green border border-green/30 hover:bg-green/10"
                        } ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <Check className="h-4 w-4" />
                      Confirmo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(guest, "declined")}
                      disabled={isSaving}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isDeclined
                        ? "bg-red-700 text-bege shadow-md"
                        : "bg-transparent text-green/80 border border-green/30 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        } ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <X className="h-4 w-4" />
                      Não vou
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
