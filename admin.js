let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];
let currentCover = null; // Зберігати стару заставку

function saveGames() {
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
}

function renderAdminGames() {
  const container = document.getElementById("adminGames");
  container.innerHTML = "";

  adminGames.forEach((game, index) => {
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
        <button onclick="editGame(${index})">✏️</button>
        <button onclick="deleteGame(${index})">🗑️</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function editGame(index) {
  const game = adminGames[index];
  document.getElementById("title").value = game.title;
  document.getElementById("description").value = game.description;
  document.getElementById("url").value = game.url;
  document.getElementById("category").value = game.category;
  currentCover = game.cover; // зберегти стару заставку
  deleteGame(index);
}

function deleteGame(index) {
  adminGames.splice(index, 1);
  saveGames();
  renderAdminGames();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const coverFile = document.getElementById("cover").files[0];

  if (coverFile) {
    const reader = new FileReader();
    reader.onload = function () {
      const coverDataURL = reader.result;
      createAndSaveGame(coverDataURL);
    };
    reader.readAsDataURL(coverFile);
  } else if (currentCover) {
    createAndSaveGame(currentCover);
  } else {
    alert("Оберіть заставку гри!");
  }
}

function createAndSaveGame(cover) {
  const newGame = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    url: document.getElementById("url").value.trim(),
    category: document.getElementById("category").value,
    cover: cover,
    likes: 0
  };

  adminGames.push(newGame);
  saveGames();
  renderAdminGames();
  document.getElementById("gameForm").reset();
  currentCover = null;
}

document.getElementById("gameForm").addEventListener("submit", handleFormSubmit);
renderAdminGames();
