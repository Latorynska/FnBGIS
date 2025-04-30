import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAfcRTTv9G5WQ9yckhNPEJZd7H8yUVs8hc",
  authDomain: "labspecsmanagement.firebaseapp.com",
  projectId: "labspecsmanagement",
  storageBucket: "labspecsmanagement.appspot.com",
  messagingSenderId: "1014616473231",
  appId: "1:1014616473231:web:3a395218edc4a898e8bafa",
  measurementId: "G-JVMS0HWQ36"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 

export default app;