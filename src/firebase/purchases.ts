import { collection, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/firebase/client";

export type Purchase = {
  sessionId: string;
  purchasedAt: Date;
};

export async function getPurchasedProductIds(): Promise<Set<string>> {
  const db = getFirestoreDb();
  const snapshot = await getDocs(collection(db, "purchased_gifts"));
  return new Set(snapshot.docs.map((d) => d.id));
}

export async function markProductAsPurchased(productId: string, sessionId: string): Promise<void> {
  const db = getFirestoreDb();
  await setDoc(doc(db, "purchased_gifts", productId), {
    sessionId,
    purchasedAt: serverTimestamp(),
  });
}
