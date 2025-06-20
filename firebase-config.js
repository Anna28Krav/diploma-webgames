// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: "AIzaSyAYynCBlk2Bbudq8CTvXCTMNE-jQH36hoE",
  authDomain: "gameverse-9494c.firebaseapp.com",
  projectId: "gameverse-9494c",
  storageBucket: "gameverse-9494c.appspot.com", // ← Виправлено
  messagingSenderId: "528371362556",
  appId: "1:528371362556:web:741f2bcf9a359cb6b34579",
  measurementId: "G-2LEEBJBPTE"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Отримуємо Firestore
export const db = getFirestore(app);
