import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCcNwViRu3RNQU3sAdETN7ZEDwaJ2z892o",
  authDomain: "sail-steel.firebaseapp.com",
  projectId: "sail-steel",
  appId: "1:573731354245:web:da3d5cc148c40673f25bec",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();