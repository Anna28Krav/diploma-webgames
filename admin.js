import { addGame, loadGames, deleteGameById, updateGame } from "./firebase-games.js";

async function renderAdminGames() {
  const container = document.getElementById("adminGames");
  container.innerHTML = "";

  const games = await loadGames();

  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";

    const coverHTML = game.cover
      ? `<img src="${game.cover}" alt="Заставка ${game.title}" class="game-cover">`
      : '';

    card.innerHTML = `
      ${coverHTML}
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <small>Категорія: ${game.category}</small>
      <div class="admin-buttons">
        <button onclick="editGame('${game.id}')">✏️</button>
        <button onclick="deleteGame('${game.id}')">🗑️</button>
      </div>
    `;

    container.appendChild(card);
  });
}

window.editGame = async function(id) {
  const games = await loadGames();
  const game = games.find(g => g.id === id);
  document.getElementById("title").value = game.title;
  document.getElementById("description").value = game.description;
  document.getElementById("url").value = game.url;
  document.getElementById("category").value = game.category;
  await deleteGameById(id); // Видалення для редагування
  await renderAdminGames();
};

window.deleteGame = async function(id) {
  await deleteGameById(id);
  await renderAdminGames();
};

document.getElementById("gameForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const coverFile = document.getElementById("cover").files[0];
  if (!coverFile) return alert("Оберіть заставку гри!");

  const reader = new FileReader();
  reader.onload = async function () {
    const coverDataURL = reader.result;

    const newGame = {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      url: document.getElementById("url").value.trim(),
      category: document.getElementById("category").value,
      cover: coverDataURL,
      likes: 0
    };

    await addGame(newGame);
    await renderAdminGames();
    e.target.reset();
  };
  reader.readAsDataURL(coverFile);
});

renderAdminGames();
