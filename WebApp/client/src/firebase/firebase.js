// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smart-estate-app.firebaseapp.com",
  projectId: "smart-estate-app",
  storageBucket: "smart-estate-app.appspot.com",
  messagingSenderId: "220040808374",
  appId: "1:220040808374:web:f839948f059493a216a317",
  measurementId: "G-E59CRX1EFB",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
