let score = 0;
let gameInterval;
let timerInterval;
let timeLeft = 60;

const hedgehog = document.getElementById("hedgehog");
const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");

const timeDisplay = document.createElement("div");
timeDisplay.id = "time";
timeDisplay.style.fontSize = "16px";
timeDisplay.style.margin = "10px";
timeDisplay.style.color = "#0ff";
document.getElementById("game-container").insertBefore(timeDisplay, gameArea);
timeDisplay.innerText = "Час: 60";

function startGame() {
  score = 0;
  timeLeft = 60;
  scoreEl.innerText = "Очки: 0";
  timeDisplay.innerText = "Час: 60";
  gameArea.querySelectorAll(".star").forEach(star => star.remove());
  document.addEventListener("mousemove", moveHedgehogMouse);
  gameInterval = setInterval(spawnStar, 800);
  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = "Час: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function moveHedgehogMouse(e) {
  const rect = gameArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  hedgehog.style.left = `${Math.min(Math.max(x, 30), rect.width - 60)}px`;
}

// Мобільне керування
function moveLeft() {
  const current = parseInt(hedgehog.style.left || "50%");
  hedgehog.style.left = `${Math.max(0, current - 30)}px`;
}

function moveRight() {
  const current = parseInt(hedgehog.style.left || "50%");
  const gameWidth = gameArea.clientWidth;
  hedgehog.style.left = `${Math.min(gameWidth - 60, current + 30)}px`;
}

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
  document.removeEventListener("mousemove", moveHedgehogMouse);
  alert("Гру завершено! Твій рахунок: " + score);
}
