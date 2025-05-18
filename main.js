const games = [
  {
    title: "Супер Маріо",
    description: "Класична пригода у грибному королівстві!",
    url: "games/super-mario/index.html"
  },
  {
    title: "Space Invaders",
    description: "Захисти Землю від прибульців!",
    url: "games/space-invaders/index.html"
  },
  {
    title: "2048",
    description: "Об'єднуй числа та досягни 2048!",
    url: "games/2048/index.html"
  }
];

const container = document.querySelector(".game-grid");

games.forEach(game => {
  const card = document.createElement("div");
  card.className = "game-card";
  card.innerHTML = `
    <h3>${game.title}</h3>
    <p>${game.description}</p>
    <a href="${game.url}" target="_blank" class="cta">Грати</a>
  `;
  container.appendChild(card);
});
