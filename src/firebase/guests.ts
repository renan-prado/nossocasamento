import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirestoreDb } from "@/firebase/client";

export type GuestStatus = "pending" | "accepted" | "declined";

export type GuestType = "full" | "half" | "supplier" | "exempt";

export const GUEST_TYPE_LABELS: Record<GuestType, string> = {
  full: "Inteiro",
  half: "Meia",
  supplier: "Fornecedor",
  exempt: "Isento",
};

export const GUEST_TYPE_WEIGHT: Record<GuestType, number> = {
  full: 1,
  half: 0.5,
  supplier: 0.5,
  exempt: 0,
};

export type Guest = {
  id: string;
  name: string;
  searchName: string;
  familyName: string;
  status: GuestStatus;
  simulado: GuestStatus;
  type: GuestType;
  updatedAt: Date | null;
};

export type GuestPayload = {
  name: string;
  searchName: string;
  familyName: string;
  status: GuestStatus;
  simulado: GuestStatus;
  type: GuestType;
};

export function normalizeSearchName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function listGuests(): Promise<Guest[]> {
  const db = getFirestoreDb();
  const q = query(collection(db, "guests"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.get("name") ?? "",
    searchName: d.get("searchName") ?? "",
    familyName: d.get("familyName") ?? "",
    status: (d.get("status") as GuestStatus) ?? "pending",
    simulado: (d.get("simulado") as GuestStatus) ?? (d.get("status") as GuestStatus) ?? "pending",
    type: (d.get("type") as GuestType) ?? "full",
    updatedAt: d.get("updatedAt")?.toDate?.() ?? null,
  }));
}

export async function createGuest(payload: GuestPayload): Promise<string> {
  const db = getFirestoreDb();
  const ref = await addDoc(collection(db, "guests"), {
    ...payload,
    updateAt: "",
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGuest(id: string, payload: Partial<GuestPayload>): Promise<void> {
  const db = getFirestoreDb();
  await updateDoc(doc(db, "guests", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGuest(id: string): Promise<void> {
  const db = getFirestoreDb();
  await deleteDoc(doc(db, "guests", id));
}
