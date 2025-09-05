const cards = document.querySelectorAll(".card");
const computerChoicesPlace = document.querySelector(".computer-choices");
const gameStateOverlay = document.querySelector("#game-state-overlay");
const gameState = document.querySelector("#game-state");
const scoreElement = document.querySelector("#score");
let score = 0;

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-overlay").classList.replace("translate-y-0", "-translate-y-[200%]");
});

let playerChoice = "";
cards.forEach((card) => {
  card.addEventListener("click", function () {
    playerChoice = card.dataset.value;
    const computerChoice = getComputerChoice();
    setCountDown(computerChoice);
  });
});
function getComputerChoice() {
  let computerChoices = ["paper", "rock", "scissors"];
  let computerChoice = computerChoices[Math.floor(Math.random() * 3)];
  return computerChoice;
}
function showComputerChoice(computerChoice) {
  let computerCard = document.createElement("div");
  computerCard.classList.add("card");
  computerCard.setAttribute("style", "margin: auto");
  computerCard.id = "computer-choice-card";

  let computerCardImage = document.createElement("img");
  computerCardImage.classList.add("card-image");
  computerCardImage.src = `img/${computerChoice}.png`;

  let computerCardTitle = document.createElement("div");
  computerCardTitle.classList.add("card-title");
  computerCardTitle.textContent = computerChoice;

  computerCard.appendChild(computerCardImage);
  computerCard.appendChild(computerCardTitle);
  computerChoicesPlace.appendChild(computerCard);
}
function setCountDown(computerChoice) {
  let countDown = document.querySelector("#count-down");
  computerChoicesPlace.classList.add("visible");
  countDown.textContent = 3;
  setTimeout(() => {
    countDown.textContent = 2;
  }, 1000);
  setTimeout(() => {
    countDown.textContent = 1;
  }, 2000);
  setTimeout(() => {
    countDown.textContent = "";
    showComputerChoice(computerChoice);
    gameStateOverlay.classList.add("visible");

    if (computerChoice === playerChoice) {
      gameState.textContent = "Draw";
    } else if ((computerChoice === "paper" && playerChoice === "rock") || (computerChoice === "rock" && playerChoice === "scissors") || (computerChoice === "scissors" && playerChoice === "paper")) {
      gameState.textContent = "You Lose";
      score = Math.max(0, score - 1);
    } else {
      gameState.textContent = "You Win";
      score++;
    }
    scoreElement.textContent = score;

    // Tambahkan animasi ke score
    scoreElement.classList.add("score-animate");

    // Hapus class animasi setelah selesai supaya bisa dipakai lagi nanti
    setTimeout(() => {
      scoreElement.classList.remove("score-animate");
    }, 750);
  }, 3000);
}
function tryAgain() {
  gameStateOverlay.classList.remove("visible");
  computerChoicesPlace.classList.remove("visible");
  document.getElementById("computer-choice-card").remove();
}
