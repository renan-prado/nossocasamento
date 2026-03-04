import { initializeApp, type FirebaseOptions, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function getFirebaseConfig(): FirebaseOptions {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error("Missing Firebase environment variables");
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

export function getFirebaseApp() {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }
  const config = getFirebaseConfig();
  return initializeApp(config);
}

export function getFirestoreDb() {
  const app = getFirebaseApp();
  return getFirestore(app);
}

