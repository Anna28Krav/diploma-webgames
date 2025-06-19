const rabbit = document.getElementById("rabbit");
const carrot = document.getElementById("carrot");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const jumpBtn = document.getElementById("jumpBtn");

let isJumping = false;
let score = 0;

function jump() {
  if (isJumping) return;
  isJumping = true;
  let position = 0;

  const upInterval = setInterval(() => {
    if (position >= 35) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 1;
          rabbit.style.bottom = position + "vh";
        }
      }, 20);
    } else {
      position += 1;
      rabbit.style.bottom = position + "vh";
    }
  }, 20);
}

// Стрибок клавішею або кнопкою
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});
jumpBtn.addEventListener("click", jump);

function moveItem(item, speed, resetCallback) {
  let left = item.offsetLeft;
  const interval = setInterval(() => {
    left -= speed;
    if (left < -window.innerWidth * 0.1) {
      resetCallback(item);
      left = window.innerWidth + Math.random() * 300;
    }

    item.style.left = left + "px";

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

// Старт руху
moveItem(carrot, 4, (item) => {
  item.style.left = "100%";
  item.style.bottom = Math.random() > 0.5 ? "10vh" : "0";
});

moveItem(obstacle, 6, (item) => {
  item.style.left = "100%";
});
