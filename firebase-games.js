// firebase-games.js 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export async function addGame(game) {
  await addDoc(collection(db, "games"), game);
}

export async function loadGames() {
  const snapshot = await getDocs(collection(db, "games"));
  const games = [];
  snapshot.forEach(docSnap => {
    games.push({ id: docSnap.id, ...docSnap.data() });
  });
  return games;
}

export async function deleteGameById(id) {
  await deleteDoc(doc(db, "games", id));
}

export async function updateGame(id, updatedData) {
  await updateDoc(doc(db, "games", id), updatedData);
}
