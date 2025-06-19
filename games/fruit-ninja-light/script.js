// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fruits = [];
let score = 0;
let isTouchActive = false;
let touchTrail = [];

const fruitImages = [
  "images/apple.png",
  "images/banana.png",
  "images/watermelon.png",
  "images/orange.png",
  "images/kiwi.png"
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

class Fruit {
  constructor(x, y, speedX, speedY, image) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.speedX = speedX;
    this.speedY = speedY;
    this.image = image;
    this.cut = false;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.35; // slightly increased gravity
  }

  draw() {
    if (!this.cut) {
      ctx.shadowColor = "white";
      ctx.shadowBlur = 20;
      ctx.drawImage(this.image, this.x - 32, this.y - 32, 64, 64);
    }
  }

  isHit(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius;
  }
}

function spawnFruit() {
  const x = Math.random() * (canvas.width - 100) + 50;
  const y = canvas.height + 50;
  const speedX = (Math.random() - 0.5) * 8;
  const speedY = -18 - Math.random() * 10; // increased jump height
  const image = fruitImages[Math.floor(Math.random() * fruitImages.length)];
  fruits.push(new Fruit(x, y, speedX, speedY, image));
}

canvas.addEventListener("mousedown", () => isTouchActive = true);
canvas.addEventListener("mouseup", () => {
  isTouchActive = false;
  touchTrail = [];
});
canvas.addEventListener("mousemove", handleMove);

canvas.addEventListener("touchstart", e => {
  isTouchActive = true;
  e.preventDefault();
});
canvas.addEventListener("touchend", () => {
  isTouchActive = false;
  touchTrail = [];
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  handleMove({ clientX: x, clientY: y });
}, { passive: false });

function handleMove(e) {
  if (!isTouchActive) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  touchTrail.push({ x, y, time: Date.now() });

  fruits.forEach(f => {
    if (!f.cut && f.isHit(x, y)) {
      f.cut = true;
      score++;
    }
  });
}

function drawTrail() {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#0ff";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let i = 0; i < touchTrail.length - 1; i++) {
    ctx.moveTo(touchTrail[i].x, touchTrail[i].y);
    ctx.lineTo(touchTrail[i + 1].x, touchTrail[i + 1].y);
  }
  ctx.stroke();

  const now = Date.now();
  touchTrail = touchTrail.filter(p => now - p.time < 300);
}

function drawScore() {
  ctx.fillStyle = "#0f0";
  ctx.font = "24px Arial";
  ctx.shadowColor = "#0f0";
  ctx.shadowBlur = 10;
  ctx.fillText(`Очки: ${score}`, 20, 30);
}

function update() {
  if (Math.random() < 0.03) spawnFruit(); // slightly more frequent

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fruits.forEach(fruit => {
    fruit.update();
    fruit.draw();
  });

  fruits = fruits.filter(f => f.y < canvas.height + 60 && !f.cut);

  drawTrail();
  drawScore();

  requestAnimationFrame(update);
}

update();
