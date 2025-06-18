import { loadGames, updateGame } from "./firebase-games.js";

let allGames = [];

function renderGames(games, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";

    const coverHTML = game.cover
      ? `<img src="${game.cover}" alt="${game.title}" class="game-cover">`
      : '';

    card.innerHTML = `
      ${coverHTML}
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <button class="like-btn" data-id="${game.id}" data-likes="${game.likes}">❤️ ${game.likes}</button><br>
      <a href="${game.url}" target="_blank" class="cta">Грати</a>
    `;

    container.appendChild(card);
  });
}

function updateTopGames() {
  const sorted = [...allGames]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);
  renderGames(sorted, "topGames");
}

function updateAllGames(filterText = "", category = "all") {
  const filtered = allGames.filter(game =>
    game.title.toLowerCase().includes(filterText.toLowerCase()) &&
    (category === "all" || game.category === category)
  );
  renderGames(filtered, "allGames");
}

function attachEvents() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  searchInput.addEventListener("input", () => {
    updateAllGames(searchInput.value, categoryFilter.value);
  });

  categoryFilter.addEventListener("change", () => {
    updateAllGames(searchInput.value, categoryFilter.value);
  });

  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("like-btn")) {
      const id = e.target.dataset.id;
      const game = allGames.find(g => g.id === id);
      game.likes += 1;
      await updateGame(id, { likes: game.likes });
      e.target.innerText = `❤️ ${game.likes}`;
      updateTopGames();
    }
  });
}

async function init() {
  allGames = await loadGames();
  updateTopGames();
  updateAllGames();
  attachEvents();
}

init();
