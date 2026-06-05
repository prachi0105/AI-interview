import { initializeApp  } from "firebase/app";
import { getAuth  , GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-73b6c.firebaseapp.com",
  projectId: "ai-interview-73b6c",
  storageBucket: "ai-interview-73b6c.firebasestorage.app",
  messagingSenderId: "654548700001",
  appId: "1:654548700001:web:3e6736c29270ed8d465320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export { auth, provider };