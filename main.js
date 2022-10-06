const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 400);
const CANVAS_HEIGHT = (canvas.height = 540);
const TILE_WIDTH = CANVAS_WIDTH / 4;
const TILE_HEIGHT = CANVAS_HEIGHT / 4;
const ROWS = 5;
let SPEED = 5;
let running = true; // game state
const tiles = [];

let firstRowState = false;
let lastStamp = 0;

class Tile {
  constructor(x, y, color, isMain) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = TILE_WIDTH;
    this.height = TILE_HEIGHT;
    this.isMain = isMain;
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color === "black" ? "white" : "black";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }

  update() {
    this.y += SPEED;
  }
}

function init() {
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    const randomCol = getRandomTile();
    for (let j = 0; j < 4; j++) {
      const tile = new Tile(
        j * TILE_WIDTH,
        i * TILE_HEIGHT,
        randomCol === j && i < ROWS - 2 ? "black" : "white",
        randomCol === j
      );
      row.push(tile);
      tile.draw();
    }
    tiles.push(row);
  }

  canvas.addEventListener("click", handleClick);
}

function gameLoop() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  loadAllTheTiles();
  updateAllTheTiles();
  id = requestAnimationFrame(gameLoop);
  // console.log(SPEED);
}

window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    cancelAnimationFrame(id);
  }
});

init();
// gameLoop();

function handleClick(e) {
  console.log(e);
}

function loadAllTheTiles() {
  const secondLastRow = tiles[ROWS - 2];
  if (!firstRowState && secondLastRow[0].y + TILE_HEIGHT > CANVAS_HEIGHT) {
    // console.log("overflow");
    const lastRow = tiles.pop();
    const randomCol = getRandomTile();
    lastRow.forEach((lr, index) => {
      lr.y = -TILE_HEIGHT + SPEED;
      lr.y = lr.isMain && false;
      if (index === randomCol) lr.color = "black";
      else lr.color = "white";
    });
    tiles.unshift(lastRow);
    firstRowState = true;
  }
  if (tiles[0][0].y >= 0) firstRowState = false;
  for (let i = 0; i < ROWS; i++) {
    const row = tiles[i];
    for (let j = 0; j < 4; j++) {
      row[j].draw();
    }
  }
}
function updateAllTheTiles() {
  for (let i = 0; i < ROWS; i++) {
    const row = tiles[i];
    for (let j = 0; j < 4; j++) {
      row[j].update();
    }
  }
}

function getRandomTile() {
  // will return random column
  return Math.round(Math.random() * 3);
}
