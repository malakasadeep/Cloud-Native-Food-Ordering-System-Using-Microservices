// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-tourism.firebaseapp.com",
  projectId: "mern-tourism",
  storageBucket: "mern-tourism.appspot.com",
  messagingSenderId: "633102065102",
  appId: "1:633102065102:web:2b05b0be2b7bfa421a1f9f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);