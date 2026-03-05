"use client";

import { FormEvent, useMemo, useState } from "react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getFirestoreDb } from "@/firebase/client";
import { useToastStore } from "@/store/toast-store";
import { Search } from "lucide-react";

type GuestStatus = "pending" | "accepted" | "declined";

type Guest = {
  id: string;
  name: string;
  familyName: string;
  status: GuestStatus;
};

type FetchState = "idle" | "loading" | "error" | "not-found";

export function RsvpSection() {
  const [typedName, setTypedName] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const db = useMemo(() => getFirestoreDb(), []);

  async function handleSearch(e?: FormEvent) {
    if (e) {
      e.preventDefault();
    }
    const trimmed = typedName.trim();
    if (!trimmed) {
      return;
    }
    setFetchState("loading");
    setErrorMessage(null);
    setSelectedGuestId(null);
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
      const familyGuests: Guest[] = familySnapshot.docs.map((d) => ({
        id: d.id,
        name: d.get("name"),
        familyName: d.get("familyName"),
        status: d.get("status") ?? "pending",
      }));
      setGuests(familyGuests);
      setSelectedGuestId(firstDoc.id);
      setFetchState("idle");
    } catch (err) {
      setFetchState("error");
      setErrorMessage("Não foi possível carregar os convidados. Tente novamente.");
    }
  }

  async function handleUpdateStatus(guest: Guest, status: GuestStatus) {
    const guestId = guest.id;
    const nextStatus: GuestStatus =
      guest.status === status ? "pending" : status;

    setSavingId(guestId);
    setErrorMessage(null);
    try {
      const guestRef = doc(db, "guests", guestId);
      await updateDoc(guestRef, {
        status: nextStatus,
        updatedAt: new Date(),
      });
      setGuests((current) =>
        current.map((g) => (g.id === guestId ? { ...g, status: nextStatus } : g)),
      );
      if (nextStatus !== "pending") {
        const actionText =
          nextStatus === "accepted" ? "confirmou presença!" : "não poderá comparecer...";
        showToast({
          type: nextStatus === "accepted" ? "success" : "error",
          message: `${guest.name} ${actionText}`,
        });
      }
    } catch (err) {
      setErrorMessage("Não foi possível salvar sua confirmação. Tente novamente.");
    } finally {
      setSavingId(null);
    }
  }

  const selectedFamilyName =
    guests.find((g) => g.id === selectedGuestId)?.familyName ?? guests[0]?.familyName;

  return (
    <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full px-4">
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-[0.5em] text-white/70 font-light text-center w-60 md:w-full">
          Casamento Danielle & Renan
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-white drop-shadow-md">
          Confirme sua presença
        </h2>
        <div className="w-16 h-px bg-white/40 mt-1" />
      </div>

      <form
        onSubmit={handleSearch}
        className="w-full flex flex-col gap-3 items-stretch"
      >
        <input
          type="text"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder="Digite seu nome completo"
          className="w-full rounded-xl border border-white/60 bg-transparent px-5 py-3 text-sm sm:text-base outline-none text-white placeholder:text-white/50 focus:border-white focus:ring-2 focus:ring-white/30"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-white text-neutral-800 px-6 py-3 text-xs sm:text-sm font-semibold shadow-lg transition-all hover:bg-white/90 hover:shadow-xl hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          disabled={fetchState === "loading"}
        >
          <Search className="h-4 w-4" />
          <span>{fetchState === "loading" ? "Buscando..." : "Buscar convidado"}</span>
        </button>
      </form>

      {fetchState === "not-found" && (
        <p className="text-sm text-red-300 text-center bg-red-900/30 backdrop-blur-sm rounded-xl px-4 py-2">
          Não encontramos seu nome na lista de convidados. Verifique a digitação.
        </p>
      )}

      {fetchState === "error" && errorMessage && (
        <p className="text-sm text-red-300 text-center bg-red-900/30 backdrop-blur-sm rounded-xl px-4 py-2">
          {errorMessage}
        </p>
      )}

      {selectedFamilyName && (
        <div className="w-full rounded-2xl bg-white shadow-xl p-5 flex flex-col gap-4 border border-neutral-100">
          <p className="text-xs tracking-[0.15em] text-neutral-500 text-center">
            <span className="font-normal">Família </span>
            <span className="font-bold text-neutral-900 uppercase">{selectedFamilyName}</span>
          </p>

          <div className="w-full h-px bg-neutral-200" />

          <ul className="flex flex-col gap-2">
            {guests.map((guest) => (
              <li
                key={guest.id}
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-200/60"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm sm:text-base font-bold text-neutral-900">
                    {guest.name}
                  </span>
                  <span className="text-[11px] sm:text-xs text-neutral-400">
                    {guest.status === "pending" && "Aguardando confirmação"}
                    {guest.status === "accepted" && "Presença confirmada"}
                    {guest.status === "declined" && "Não poderá comparecer"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(guest, "accepted")}
                    disabled={savingId === guest.id}
                    className={`h-9 w-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all cursor-pointer ${
                      guest.status === "accepted"
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-neutral-100 text-neutral-400 border-transparent hover:border-green-500 hover:text-green-600 hover:bg-green-50"
                    } ${savingId === guest.id ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(guest, "declined")}
                    disabled={savingId === guest.id}
                    className={`h-9 w-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all cursor-pointer ${
                      guest.status === "declined"
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-neutral-100 text-neutral-400 border-transparent hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                    } ${savingId === guest.id ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
