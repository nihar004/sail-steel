import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/['"]/g, ''),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.replace(/['"]/g, ''),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.replace(/['"]/g, ''),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/['"]/g, ''),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.replace(/['"]/g, ''),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.replace(/['"]/g, ''),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.replace(/['"]/g, '')
};

console.log('Firebase Config:', firebaseConfig); // For debugging, remove in production

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();