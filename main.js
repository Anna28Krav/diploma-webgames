// Імпортуємо Firebase модулі
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

// 1. Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Контейнер для топ-ігор
const topContainer = document.getElementById("topGames");

// 3. Завантаження ігор з Firestore
async function loadTopGames() {
  try {
    const snapshot = await getDocs(collection(db, "games"));
    const games = [];
    snapshot.forEach(docSnap => {
      games.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Сортуємо за лайками і обираємо топ-3
    const topGames = games.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);

    renderTopGames(topGames);
  } catch (err) {
    console.error("Помилка при завантаженні ігор:", err);
  }
}

// 4. Рендер карток ігор
function renderTopGames(games) {
  if (!topContainer) return;
  topContainer.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";

    const cover = game.cover
      ? `<img src="${game.cover}" alt="${game.title}" class="game-cover">`
      : "";

    card.innerHTML = `
      ${cover}
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <button class="like-btn" data-id="${game.id}" data-likes="${game.likes || 0}">
        ❤️ ${game.likes || 0}
      </button><br>
      <a href="${game.url}" target="_blank" class="cta">Грати</a>
    `;

    topContainer.appendChild(card);
  });
}

// 5. Обробка лайків
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("like-btn")) {
    const id = e.target.dataset.id;
    let likes = parseInt(e.target.dataset.likes || "0", 10);
    likes++;

    try {
      // Оновлення в базі
      await updateDoc(doc(db, "games", id), { likes });

      // Миттєве оновлення тексту кнопки
      e.target.textContent = `❤️ ${likes}`;
      e.target.dataset.likes = likes.toString();
    } catch (err) {
      console.error("Помилка при оновленні лайків:", err);
    }
  }
});

// 6. Старт
loadTopGames();
