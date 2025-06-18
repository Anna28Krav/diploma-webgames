const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird, gravity, velocity, pipes, score, gameInterval;

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-over").style.display = "none";

  bird = { x: 50, y: 150, r: 15 };
  gravity = 0.6;
  velocity = 0;
  pipes = [];
  score = 0;

  for (let i = 0; i < 3; i++) {
    pipes.push(createPipe(300 + i * 200));
  }

  gameInterval = setInterval(updateGame, 1000 / 60);
}

function createPipe(x) {
  const gap = 130;
  const topHeight = Math.random() * 250 + 50;
  return {
    x: x,
    top: topHeight,
    bottom: topHeight + gap,
    width: 50
  };
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird glow
  velocity += gravity;
  bird.y += velocity;
  const gradient = ctx.createRadialGradient(bird.x, bird.y, bird.r * 0.3, bird.x, bird.y, bird.r * 1.5);
  gradient.addColorStop(0, "#0ff");
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.r * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0ff";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fill();

  // Pipes
  for (let pipe of pipes) {
    pipe.x -= 2;

    if (pipe.x + pipe.width < 0) {
      pipe.x = canvas.width;
      pipe.top = Math.random() * 250 + 50;
      pipe.bottom = pipe.top + 130;
      score++;
    }

    ctx.fillStyle = "#f0f";
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

    if (
      bird.x + bird.r > pipe.x &&
      bird.x - bird.r < pipe.x + pipe.width &&
      (bird.y - bird.r < pipe.top || bird.y + bird.r > pipe.bottom)
    ) {
      endGame();
      return;
    }
  }

  if (bird.y + bird.r > canvas.height || bird.y - bird.r < 0) {
    endGame();
  }

  ctx.fillStyle = "white";
  ctx.font = "24px Segoe UI";
  ctx.fillText("Очки: " + score, 10, 30);
}

function flap() {
  velocity = -8;
}

function endGame() {
  clearInterval(gameInterval);
  document.getElementById("score").innerText = "Твій рахунок: " + score;
  document.getElementById("game-over").style.display = "flex";
}

document.addEventListener("keydown", flap);
document.getElementById("touch-btn").addEventListener("touchstart", flap);
