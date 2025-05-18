let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];

function saveGames() {
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
}

function renderAdminGames() {
  const container = document.getElementById("adminGames");
  container.innerHTML = "";
  adminGames.forEach((game, index) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
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
  deleteGame(index);
}

function deleteGame(index) {
  adminGames.splice(index, 1);
  saveGames();
  renderAdminGames();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const newGame = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    url: document.getElementById("url").value,
    category: document.getElementById("category").value,
    likes: 0
  };
  adminGames.push(newGame);
  saveGames();
  renderAdminGames();
  e.target.reset();
}

document.getElementById("gameForm").addEventListener("submit", handleFormSubmit);
renderAdminGames();
