import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp, type Timestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/firebase/client";

export type MessagePayload = {
  name: string;
  message: string;
  gifts: string;
};

export type Message = {
  id: string;
  name: string;
  message: string;
  gifts: string;
  createdAt: Date | null;
};

export async function saveMessage(payload: MessagePayload): Promise<void> {
  const db = getFirestoreDb();
  await addDoc(collection(db, "messages"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function deleteMessage(id: string): Promise<void> {
  const db = getFirestoreDb();
  await deleteDoc(doc(db, "messages", id));
}

export async function listMessages(): Promise<Message[]> {
  const db = getFirestoreDb();
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.get("name") ?? "",
    message: d.get("message") ?? "",
    gifts: d.get("gifts") ?? "",
    createdAt: (d.get("createdAt") as Timestamp | null)?.toDate() ?? null,
  }));
}
