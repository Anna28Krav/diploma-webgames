let score = 0;
let timeLeft = 30;
let gameInterval;
let targetInterval;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const field = document.getElementById("playfield");
const btn = document.getElementById("startBtn");

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.innerText = "Очки: 0";
  timerEl.innerText = "Час: 30";
  btn.disabled = true;
  field.innerHTML = "";

  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = "Час: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  targetInterval = setInterval(spawnTarget, 600);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(targetInterval);
  btn.disabled = false;
  alert("Гру завершено! Твій рахунок: " + score);
}

function spawnTarget() {
  const target = document.createElement("div");
  target.className = "target";
  const size = 40;
  const x = Math.random() * (field.clientWidth - size);
  const y = Math.random() * (field.clientHeight - size);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  
  target.onclick = () => {
    score++;
    scoreEl.innerText = "Очки: " + score;
    field.removeChild(target);
  };

  field.appendChild(target);
  setTimeout(() => {
    if (field.contains(target)) field.removeChild(target);
  }, 1500);
}
