// Отримати список ігор з localStorage
let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];

// Зберегти в localStorage
function saveGames() {
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
}

// Відобразити ігри
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

// Редагування гри
function editGame(index) {
  const game = adminGames[index];
  document.getElementById("title").value = game.title;
  document.getElementById("description").value = game.description;
  document.getElementById("url").value = game.url;
  document.getElementById("category").value = game.category;
  deleteGame(index); // Видалити стару версію для оновлення
}

// Видалення гри
function deleteGame(index) {
  adminGames.splice(index, 1);
  saveGames();
  renderAdminGames();
}

// Додавання гри через форму
function handleFormSubmit(e) {
  e.preventDefault();

  const coverFile = document.getElementById("cover").files[0];

  if (!coverFile) {
    alert("Оберіть заставку гри!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const coverDataURL = reader.result;

    const newGame = {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      url: document.getElementById("url").value.trim(),
      category: document.getElementById("category").value,
      cover: coverDataURL, // base64 заставка
      likes: 0
    };

    adminGames.push(newGame);
    saveGames();
    renderAdminGames();
    e.target.reset(); // Очистити форму
  };

  reader.readAsDataURL(coverFile); // Прочитати файл заставки
}

// Прив'язка обробника події
document.getElementById("gameForm").addEventListener("submit", handleFormSubmit);

// Відобразити ігри на старті
renderAdminGames();
