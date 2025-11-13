import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKju9k3sSaNhxCYGwYmhOoFC7HhfOo5ZY",
  authDomain: "finance-personal-85144.firebaseapp.com",
  projectId: "finance-personal-85144",
  storageBucket: "finance-personal-85144.appspot.com",
  messagingSenderId: "235976190527",
  appId: "1:235976190527:web:b7e936eedafbbe2b91268a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
