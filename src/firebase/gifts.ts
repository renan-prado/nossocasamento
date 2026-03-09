import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/firebase/client";

export type Gift = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export type GiftPayload = {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export async function listGifts(): Promise<Gift[]> {
  const db = getFirestoreDb();
  const q = query(collection(db, "gifts"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.get("name") ?? "",
    description: d.get("description") ?? null,
    price: d.get("price") ?? 0,
    imageUrl: d.get("imageUrl") ?? null,
    available: d.get("available") ?? true,
  }));
}

export async function createGift(payload: GiftPayload): Promise<string> {
  const db = getFirestoreDb();
  const ref = await addDoc(collection(db, "gifts"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGift(id: string, payload: Partial<GiftPayload>): Promise<void> {
  const db = getFirestoreDb();
  await updateDoc(doc(db, "gifts", id), payload);
}

export async function deleteGift(id: string): Promise<void> {
  const db = getFirestoreDb();
  await deleteDoc(doc(db, "gifts", id));
}
