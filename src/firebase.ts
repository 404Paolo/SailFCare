import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAklOk-qeKpScPvbgrDkw3w121SBSNZRwU",
  authDomain: "sailfcare-c8e45.firebaseapp.com",
  projectId: "sailfcare-c8e45",
  storageBucket: "sailfcare-c8e45.firebasestorage.app",
  messagingSenderId: "438567097458",
  appId: "1:438567097458:web:9d5f6b135333f575de1eeb",
  measurementId: "G-SY4BX35144"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);