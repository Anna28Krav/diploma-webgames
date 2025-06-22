// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

export const firebaseConfig = {
  apiKey: "AIzaSyAYynCBlk2Bbudq8CTvXCTMNE-jQH36hoE",
  authDomain: "gameverse-9494c.firebaseapp.com",
  projectId: "gameverse-9494c",
  storageBucket: "gameverse-9494c.appspot.com",
  messagingSenderId: "528371362556",
  appId: "1:528371362556:web:741f2bcf9a359cb6b34579",
  measurementId: "G-2LEEBJBPTE"
};

// 1. Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// 2. Firestore
export const db = getFirestore(app);

// 3. Анонімна авторизація
const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Анонімно увійшли");
  })
  .catch((error) => {
    console.error("❌ Помилка авторизації:", error);
  });
