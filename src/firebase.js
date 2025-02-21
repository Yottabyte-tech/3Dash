// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (get this from Firebase console)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBqftKj604Zx_-erVbJTIFXjwOVY5pPHYg",
    authDomain: "simpleincrement.firebaseapp.com",
    projectId: "simpleincrement",
    storageBucket: "simpleincrement.firebasestorage.app",
    messagingSenderId: "1011198077000",
    appId: "1:1011198077000:web:080529039f31d8f98c907d",
    measurementId: "G-59DM3GW27F"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;
