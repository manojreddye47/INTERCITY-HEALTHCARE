// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const globalProcess = typeof globalThis !== 'undefined' && (globalThis as any).process ? (globalThis as any).process.env : {};
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : globalProcess;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyB61Btnda6T8Hb6vuvF6isCCDo4lQKrepc",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "intercity-healthcare.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "intercity-healthcare",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "intercity-healthcare.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "740822421383",
  appId: env.VITE_FIREBASE_APP_ID || "1:740822421383:web:7ab912dba6969681a10d22",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-C8S99ZHW52",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
