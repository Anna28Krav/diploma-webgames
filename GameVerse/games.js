let allGames = JSON.parse(localStorage.getItem("adminGames")) || [];

function renderGames(games, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <button class="like-btn" data-title="${game.title}">❤️ ${game.likes}</button><br>
      <a href="${game.url}" target="_blank" class="cta">Грати</a>
    `;
    container.appendChild(card);
  });
}

function updateTopGames() {
  const sorted = [...allGames].sort((a, b) => b.likes - a.likes).slice(0, 3);
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
  document.getElementById("searchInput").addEventListener("input", e => {
    const text = e.target.value;
    const category = document.getElementById("categoryFilter").value;
    updateAllGames(text, category);
  });

  document.getElementById("categoryFilter").addEventListener("change", e => {
    const category = e.target.value;
    const text = document.getElementById("searchInput").value;
    updateAllGames(text, category);
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("like-btn")) {
      const title = e.target.dataset.title;
      const game = allGames.find(g => g.title === title);
      game.likes++;
      e.target.innerText = `❤️ ${game.likes}`;
      localStorage.setItem("adminGames", JSON.stringify(allGames));
      updateTopGames();
    }
  });
}

updateTopGames();
updateAllGames();
attachEvents();
