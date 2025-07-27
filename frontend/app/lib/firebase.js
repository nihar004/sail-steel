import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCcNwViRu3RNQU3sAdETN7ZEDwaJ2z892o",
  authDomain: "sail-steel.firebaseapp.com",
  projectId: "sail-steel",
  storageBucket: "sail-steel.firebasestorage.app",
  messagingSenderId: "573731354245",
  appId: "1:573731354245:web:da3d5cc148c40673f25bec",
  measurementId: "G-VJH814GV36"
};

console.log('Firebase Config:', firebaseConfig); // For debugging, remove in production

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();