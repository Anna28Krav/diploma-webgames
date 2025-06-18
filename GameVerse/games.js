// Завантаження ігор з localStorage
let allGames = JSON.parse(localStorage.getItem("adminGames")) || [];

// Рендер карток ігор (з заставкою, лайками та кнопкою "Грати")
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
      <button class="like-btn" data-title="${game.title}">❤️ ${game.likes}</button><br>
      <a href="${game.url}" target="_blank" class="cta">Грати</a>
    `;

    container.appendChild(card);
  });
}

// Топ 3 гри за кількістю лайків
function updateTopGames() {
  const sorted = [...allGames]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);
  renderGames(sorted, "topGames");
}

// Фільтрація ігор за текстом і категорією
function updateAllGames(filterText = "", category = "all") {
  const filtered = allGames.filter(game =>
    game.title.toLowerCase().includes(filterText.toLowerCase()) &&
    (category === "all" || game.category === category)
  );
  renderGames(filtered, "allGames");
}

// Прив’язка подій до інтерфейсу
function attachEvents() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  searchInput.addEventListener("input", () => {
    const text = searchInput.value;
    const category = categoryFilter.value;
    updateAllGames(text, category);
  });

  categoryFilter.addEventListener("change", () => {
    const category = categoryFilter.value;
    const text = searchInput.value;
    updateAllGames(text, category);
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("like-btn")) {
      const title = e.target.dataset.title;
      const game = allGames.find(g => g.title === title);
      game.likes++;
      localStorage.setItem("adminGames", JSON.stringify(allGames));
      e.target.innerText = `❤️ ${game.likes}`;
      updateTopGames();
    }
  });
}

// Ініціалізація
updateTopGames();
updateAllGames();
attachEvents();
