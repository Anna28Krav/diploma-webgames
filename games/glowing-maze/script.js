const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let COLS = 12;
let ROWS = 8;
const CELL_SIZE = 50;

let player, goal, grid, startTime, timerInterval;
let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
  }

  draw() {
    const x = this.x * CELL_SIZE;
    const y = this.y * CELL_SIZE;
    ctx.strokeStyle = "#f0f";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#f0f";
    ctx.shadowBlur = 15;

    if (this.walls.top) drawLine(x, y, x + CELL_SIZE, y);
    if (this.walls.right) drawLine(x + CELL_SIZE, y, x + CELL_SIZE, y + CELL_SIZE);
    if (this.walls.bottom) drawLine(x + CELL_SIZE, y + CELL_SIZE, x, y + CELL_SIZE);
    if (this.walls.left) drawLine(x, y + CELL_SIZE, x, y);
  }
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function index(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return -1;
  return x + y * COLS;
}

function generateMaze() {
  grid = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      grid.push(new Cell(x, y));
    }
  }

  let stack = [];
  let current = grid[0];
  current.visited = true;

  while (true) {
    let neighbors = [];
    const directions = [
      { dx: 0, dy: -1, wall: "top", opp: "bottom" },
      { dx: 1, dy: 0, wall: "right", opp: "left" },
      { dx: 0, dy: 1, wall: "bottom", opp: "top" },
      { dx: -1, dy: 0, wall: "left", opp: "right" }
    ];

    for (let dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      const neighborIndex = index(nx, ny);
      if (neighborIndex !== -1 && !grid[neighborIndex].visited) {
        neighbors.push({ neighbor: grid[neighborIndex], dir });
      }
    }

    if (neighbors.length > 0) {
      const { neighbor, dir } = neighbors[Math.floor(Math.random() * neighbors.length)];
      current.walls[dir.wall] = false;
      neighbor.walls[dir.opp] = false;
      neighbor.visited = true;
      stack.push(current);
      current = neighbor;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else break;
  }
}

function setDifficulty(level) {
  if (level === "easy") { COLS = 8; ROWS = 6; }
  else if (level === "medium") { COLS = 12; ROWS = 8; }
  else if (level === "hard") { COLS = 18; ROWS = 12; }

  canvas.width = COLS * CELL_SIZE;
  canvas.height = ROWS * CELL_SIZE;

  startNewGame();
}

function startNewGame() {
  generateMaze();
  player = { x: 0, y: 0, size: CELL_SIZE - 10, color: "#0ff" };
  goal = { x: COLS - 1, y: ROWS - 1, size: CELL_SIZE - 10, color: "#0f0" };
  startTime = Date.now();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("timer").textContent = `⏱ Час: ${elapsed} сек`;
  }, 100);

  if (typeof gameLoopId === "number") cancelAnimationFrame(gameLoopId);
  gameLoop();
}

function update() {
  const i = index(player.x, player.y);
  const cell = grid[i];

  if (keys["ArrowUp"] && !cell.walls.top) player.y--;
  if (keys["ArrowDown"] && !cell.walls.bottom) player.y++;
  if (keys["ArrowLeft"] && !cell.walls.left) player.x--;
  if (keys["ArrowRight"] && !cell.walls.right) player.x++;

  player.x = Math.max(0, Math.min(COLS - 1, player.x));
  player.y = Math.max(0, Math.min(ROWS - 1, player.y));

  if (player.x === goal.x && player.y === goal.y) {
    clearInterval(timerInterval);
    setTimeout(() => {
      const timePassed = ((Date.now() - startTime) / 1000).toFixed(1);
      alert(`🎉 Перемога! Час: ${timePassed} сек`);
      startNewGame();
    }, 100);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let cell of grid) cell.draw();

  ctx.fillStyle = goal.color;
  ctx.shadowColor = goal.color;
  ctx.shadowBlur = 10;
  ctx.fillRect(goal.x * CELL_SIZE + 5, goal.y * CELL_SIZE + 5, goal.size, goal.size);

  ctx.fillStyle = player.color;
  ctx.shadowColor = player.color;
  ctx.shadowBlur = 15;
  ctx.fillRect(player.x * CELL_SIZE + 5, player.y * CELL_SIZE + 5, player.size, player.size);
}

let gameLoopId;
function gameLoop() {
  update();
  draw();
  gameLoopId = requestAnimationFrame(gameLoop);
}

setDifficulty("medium");
