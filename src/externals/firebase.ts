import { initializeApp, FirebaseOptions } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG as string) as FirebaseOptions;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  return await signInWithPopup(auth, googleAuthProvider);
};
