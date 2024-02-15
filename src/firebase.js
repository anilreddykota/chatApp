// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe9u3_pBODk-oeva-GxjdaQECHDr0alhI",
  authDomain: "chatappsocketanil.firebaseapp.com",
  projectId: "chatappsocketanil",
  storageBucket: "chatappsocketanil.appspot.com",
  messagingSenderId: "736990892314",
  appId: "1:736990892314:web:69a2b151351cf72ace9ca3",
  measurementId: "G-BP39KRDGXC"
};

// Initialize Firebase
const app =initializeApp(firebaseConfig)
export const messaging = getMessaging(app);
