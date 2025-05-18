let grid;
let score = 0;
const gridSize = 4;

function startGame() {
  score = 0;
  document.getElementById("score").innerText = "Очки: 0";
  grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  addNumber();
  addNumber();
  updateGrid();
}

function addNumber() {
  let empty = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  let spot = empty[Math.floor(Math.random() * empty.length)];
  grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
}

function updateGrid(mergedCells = []) {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = "";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.className = "tile";
      if (mergedCells.some(pos => pos.r === r && pos.c === c)) {
        cell.classList.add("tile-merged");
      }
      if (grid[r][c] !== 0) cell.innerText = grid[r][c];
      gridContainer.appendChild(cell);
    }
  }
  document.getElementById("score").innerText = "Очки: " + score;
}

function slide(row, rIndex, mergedMap) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
      mergedMap.push({ r: rIndex, c: i });
    }
  }
  return [...arr.filter(val => val), ...Array(gridSize - arr.filter(val => val).length).fill(0)];
}

function rotateGrid() {
  const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      newGrid[c][gridSize - 1 - r] = grid[r][c];
    }
  }
  grid = newGrid;
}

function handleMove(direction) {
  let changed = false;
  let mergedMap = [];
  for (let i = 0; i < direction; i++) rotateGrid();
  for (let r = 0; r < gridSize; r++) {
    const original = [...grid[r]];
    grid[r] = slide(grid[r], r, mergedMap);
    if (!changed && original.some((val, idx) => val !== grid[r][idx])) {
      changed = true;
    }
  }
  for (let i = 0; i < (4 - direction) % 4; i++) rotateGrid();
  if (changed) {
    addNumber();
    updateGrid(mergedMap);
  } else {
    updateGrid();
  }
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft": handleMove(0); break;
    case "ArrowUp": handleMove(1); break;
    case "ArrowRight": handleMove(2); break;
    case "ArrowDown": handleMove(3); break;
  }
});

startGame();
