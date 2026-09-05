import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase configuration.
 *
 * Fill these in with your own Firebase project values. Either set them as
 * environment variables (VITE_FIREBASE_*) or paste the literal strings from the
 * Firebase console ("Project settings" -> "Your apps" -> SDK setup).
 */
export const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] ?? "",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] ?? "",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] ?? "",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] ?? "",
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] ?? "",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] ?? "",
};

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!authInstance) authInstance = getAuth(a);
  return authInstance;
}

export function getDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!dbInstance) dbInstance = getFirestore(a);
  return dbInstance;
}

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase is not configured yet. Add your project keys in src/lib/firebase.ts.");
    this.name = "FirebaseNotConfiguredError";
  }
}

export function requireDb(): Firestore {
  const db = getDb();
  if (!db) throw new FirebaseNotConfiguredError();
  return db;
}
