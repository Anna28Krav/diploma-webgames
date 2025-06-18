// ======= ІГРИ З LOCALSTORAGE =======
let allGames = JSON.parse(localStorage.getItem("adminGames")) || [];

// ======= HTML-КОНТЕЙНЕР =======
const topContainer = document.querySelector(".game-grid.top");

// ======= ВІДОБРАЖЕННЯ ТОПОВИХ ІГОР =======
function renderTopGames() {
  // Перевірка на наявність контейнера
  if (!topContainer) return;

  // Очищення
  topContainer.innerHTML = "";

  // Сортування за лайками та вибір топ-3
  const topGames = [...allGames]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  // Рендер кожної гри
  topGames.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";

    const cover = game.cover
      ? `<img src="${game.cover}" alt="${game.title}" class="game-cover">`
      : "";

    card.innerHTML = `
      ${cover}
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <button class="like-btn" data-title="${game.title}">❤️ ${game.likes}</button><br>
      <a href="${game.url}" target="_blank" class="cta">Грати</a>
    `;

    topContainer.appendChild(card);
  });
}

// ======= ОБРОБКА ЛАЙКІВ =======
document.addEventListener("click", e => {
  if (e.target.classList.contains("like-btn")) {
    const title = e.target.dataset.title;
    const game = allGames.find(g => g.title === title);
    if (game) {
      game.likes = (game.likes || 0) + 1;
      localStorage.setItem("adminGames", JSON.stringify(allGames));
      renderTopGames(); // оновити топ без перезавантаження
    }
  }
});

// ======= ПЕРШЕ ЗАВАНТАЖЕННЯ =======
renderTopGames();
