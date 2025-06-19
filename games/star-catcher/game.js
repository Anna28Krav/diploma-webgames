let score = 0;
let timeLeft = 60;
let gameInterval;
let timerInterval;

const hedgehog = document.getElementById("hedgehog");
const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

function startGame() {
  score = 0;
  timeLeft = 60;
  scoreEl.innerText = "Очки: 0";
  timerEl.innerText = "Час: 60";
  gameArea.querySelectorAll(".star").forEach(star => star.remove());

  gameInterval = setInterval(spawnStar, 800);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = "Час: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// 🔁 Плавний рух їжачка пальцем (drag по екрану)
gameArea.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const rect = gameArea.getBoundingClientRect();
  const touchX = touch.clientX - rect.left;
  const areaWidth = rect.width;

  const newX = Math.min(
    areaWidth - hedgehog.offsetWidth,
    Math.max(0, touchX - hedgehog.offsetWidth / 2)
  );

  hedgehog.style.left = `${newX}px`;
});

function spawnStar() {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
  star.style.animationDuration = (2 + Math.random() * 2) + "s";
  gameArea.appendChild(star);

  const fall = setInterval(() => {
    const starRect = star.getBoundingClientRect();
    const hedgehogRect = hedgehog.getBoundingClientRect();

    if (
      starRect.bottom >= hedgehogRect.top &&
      starRect.left < hedgehogRect.right &&
      starRect.right > hedgehogRect.left
    ) {
      score++;
      scoreEl.innerText = "Очки: " + score;
      star.remove();
      clearInterval(fall);
    }
    if (starRect.top > gameArea.getBoundingClientRect().bottom) {
      star.remove();
      clearInterval(fall);
    }
  }, 30);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  alert("Гру завершено! Твій рахунок: " + score);
}
