const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const frog = new Image();
frog.src = "frog.png";

const star = new Image();
star.src = "star.png";

const logImg = new Image();
logImg.src = "log.png";

const imagesToLoad = [frog, star, logImg];
let loadedCount = 0;

imagesToLoad.forEach(img => {
  img.onload = () => {
    loadedCount++;
    if (loadedCount === imagesToLoad.length) {
      startGame();
    }
  };
});

function startGame() {
  let score = 0;
  let time = 60;
  let stars = [];
  let logs = [];

  const player = {
    x: 400,
    y: 400,
    width: 50,
    height: 50,
    dy: 0,
    onLog: false
  };

  function createLog(x, y, speed) {
    return { x, y, width: 120, height: 30, speed };
  }

  function createStar() {
    return {
      x: Math.random() * (canvas.width - 30),
      y: Math.random() * (canvas.height - 100),
      collected: false
    };
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.y += player.dy;
    player.dy += 0.5;

    if (player.y + player.height > canvas.height)
      player.y = canvas.height - player.height;

    player.onLog = false;

    for (let log of logs) {
      log.x += log.speed;
      if (log.x > canvas.width) log.x = -log.width;

      ctx.drawImage(logImg, log.x, log.y, log.width, log.height);

      if (
        player.x + player.width > log.x &&
        player.x < log.x + log.width &&
        player.y + player.height > log.y &&
        player.y + player.height < log.y + log.height + 10
      ) {
        player.onLog = true;
        player.dy = 0;
        player.y = log.y - player.height;
      }
    }

    ctx.drawImage(frog, player.x, player.y, player.width, player.height);

    let allCollected = true;
    for (let s of stars) {
      if (!s.collected) {
        allCollected = false;
        ctx.drawImage(star, s.x, s.y, 30, 30);
        if (
          player.x < s.x + 30 &&
          player.x + player.width > s.x &&
          player.y < s.y + 30 &&
          player.y + player.height > s.y
        ) {
          s.collected = true;
          score++;
          document.getElementById("score").innerText = "Score: " + score;
        }
      }
    }

    if (allCollected) {
      alert("🎉 Вітаємо! Ви зібрали всі зірки!");
      location.reload();
    }

    document.getElementById("time").innerText = "Time: " + time;
  }

  function loop() {
    update();
    requestAnimationFrame(loop);
  }

  const timer = setInterval(() => {
    time--;
    if (time <= 0) {
      clearInterval(timer);
      if (stars.every(s => s.collected)) {
        alert("🎉 Вітаємо! Ви зібрали всі зірки вчасно!");
      } else {
        alert("⏳ Час вийшов! Ви не встигли зібрати всі зірки.");
      }
      location.reload();
    }
  }, 1000);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.x -= 20;
    if (e.key === "ArrowRight") player.x += 20;
    if (e.key === "ArrowUp") player.dy = -10;
  });

  // Кількість колод і зірок випадкова
  const logLevels = [320, 350, 380, 410];
  for (let i = 0; i < 6; i++) {
    const y = logLevels[Math.floor(Math.random() * logLevels.length)];
    logs.push(createLog(i * 160, y, 1.5 + Math.random()));
  }

  const starCount = 5 + Math.floor(Math.random() * 6); // Від 5 до 10 зірок
  for (let i = 0; i < starCount; i++) {
    stars.push(createStar());
  }

  loop();
}