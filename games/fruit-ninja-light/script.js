const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let fruits = [];
let score = 0;
let isMouseDown = false;
let mouseTrail = [];

// Завантаження зображень
const fruitImages = [
  "apple.png", "banana.png", "watermelon.png", "orange.png", "kiwi.png"
].map(name => {
  const img = new Image();
  img.src = `images/${name}`;
  return img;
});

// Фрукт
class Fruit {
  constructor(x, y, speedX, speedY, image) {
    this.x = x;
    this.y = y;
    this.radius = 40; // для hitbox
    this.speedX = speedX;
    this.speedY = speedY;
    this.image = image;
    this.cut = false;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.3; // гравітація
  }

  draw() {
    if (!this.cut) {
      ctx.shadowColor = "white";
      ctx.shadowBlur = 20;
      ctx.drawImage(this.image, this.x - 32, this.y - 32, 64, 64);
    }
  }

  isHit(mx, my) {
    const dx = this.x - mx;
    const dy = this.y - my;
    return Math.sqrt(dx * dx + dy * dy) < this.radius;
  }
}

function spawnFruit() {
  const x = Math.random() * (canvas.width - 100) + 50;
  const y = canvas.height + 20;
  const speedX = (Math.random() - 0.5) * 6;
  const speedY = -8 - Math.random() * 5;
  const image = fruitImages[Math.floor(Math.random() * fruitImages.length)];
  fruits.push(new Fruit(x, y, speedX, speedY, image));
}

// Миша
canvas.addEventListener("mousedown", () => isMouseDown = true);
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  mouseTrail = [];
});
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (isMouseDown) {
    mouseTrail.push({ x: mx, y: my, time: Date.now() });

    fruits.forEach(fruit => {
      if (!fruit.cut && fruit.isHit(mx, my)) {
        fruit.cut = true;
        score++;
      }
    });
  }
});

function drawTrail() {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#0ff";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  for (let i = 0; i < mouseTrail.length - 1; i++) {
    ctx.moveTo(mouseTrail[i].x, mouseTrail[i].y);
    ctx.lineTo(mouseTrail[i + 1].x, mouseTrail[i + 1].y);
  }
  ctx.stroke();
  const now = Date.now();
  mouseTrail = mouseTrail.filter(p => now - p.time < 300);
}

function drawScore() {
  ctx.fillStyle = "#0f0";
  ctx.font = "24px Arial";
  ctx.shadowColor = "#0f0";
  ctx.shadowBlur = 10;
  ctx.fillText(`Очки: ${score}`, 10, 30);
}

function update() {
  if (Math.random() < 0.02) spawnFruit();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fruits.forEach(f => {
    f.update();
    f.draw();
  });

  fruits = fruits.filter(f => f.y < canvas.height + 50 && !f.cut);

  drawTrail();
  drawScore();

  requestAnimationFrame(update);
}

update();
