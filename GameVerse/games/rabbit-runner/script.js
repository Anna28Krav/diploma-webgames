const rabbit = document.getElementById("rabbit");
const carrot = document.getElementById("carrot");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");

let isJumping = false;
let score = 0;

function jump() {
  if (isJumping) return;
  isJumping = true;
  let position = 0;

  const upInterval = setInterval(() => {
    if (position >= 120) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 5;
          rabbit.style.bottom = position + "px";
        }
      }, 20);
    } else {
      position += 5;
      rabbit.style.bottom = position + "px";
    }
  }, 20);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});

function moveItem(item, speed, resetCallback) {
  let left = item.offsetLeft;
  const interval = setInterval(() => {
    left -= speed;
    if (left < -60) {
      resetCallback(item);
      left = game.offsetWidth + Math.random() * 300;
    }

    item.style.left = left + "px";

    // collision with rabbit
    const rabbitRect = rabbit.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (
      rabbitRect.left < itemRect.right &&
      rabbitRect.right > itemRect.left &&
      rabbitRect.bottom > itemRect.top &&
      rabbitRect.top < itemRect.bottom
    ) {
      if (item === carrot) {
        score++;
        scoreDisplay.innerText = "Очки: " + score;
        resetCallback(item);
      } else if (item === obstacle) {
        alert("💥 Ви наткнулись на перешкоду! Очки: " + score);
        location.reload();
      }
    }
  }, 20);
}

moveItem(carrot, 4, (item) => {
  item.style.left = "100%";
  item.style.bottom = Math.random() > 0.5 ? "60px" : "0";
});

moveItem(obstacle, 6, (item) => {
  item.style.left = "100%";
});