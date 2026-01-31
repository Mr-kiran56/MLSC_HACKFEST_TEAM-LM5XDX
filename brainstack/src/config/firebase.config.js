// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPgNoo9NTp7OE6X-hml_cU8kJksEQrzio",
  authDomain: "otp-bft-9cf6b.firebaseapp.com",
  projectId: "otp-bft-9cf6b",
  storageBucket: "otp-bft-9cf6b.firebasestorage.app",
  messagingSenderId: "785065928558",
  appId: "1:785065928558:web:ce92b942bb0031d6b0037f",
  measurementId: "G-3RLCK0ZFF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const auth = getAuth(app);
