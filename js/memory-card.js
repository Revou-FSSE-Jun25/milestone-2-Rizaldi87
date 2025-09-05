function generateCards(gridId, cardCount) {
  const grid = document.querySelector(gridId);
  const cardHtml = `
    <div class="card cursor-pointer bg-gray-800 rounded-2xl shadow-lg p-6 w-full md:w-40 h-[225px] flex flex-col items-center justify-center text-white transition-transform duration-300 relative">
      <p class="card-text text-gray-300 text-[6rem] text-center"></p>
    </div>`;

  for (let i = 0; i < cardCount; i++) {
    const card = document.createElement("div");
    card.innerHTML = cardHtml;
    grid.appendChild(card);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function assignLettersToCards(cardTexts, letters) {
  const pairedLetters = shuffleArray([...letters, ...letters]);
  cardTexts.forEach((cardText, index) => {
    cardText.textContent = pairedLetters[index] || "";
  });
}

function onCardClick(e) {
  const card = e.currentTarget;
  if (card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  checkFlippedCards();
}

function checkFlippedCards() {
  if (flippedCards.length === 2) {
    const [firstCard, secondCard] = flippedCards;
    const firstText = firstCard.querySelector(".card-text").textContent;
    const secondText = secondCard.querySelector(".card-text").textContent;

    if (firstText === secondText) {
      flippedCards.length = 0;
      paired++;
      pairedDisplay.textContent = paired;

      checkWin();
    } else {
      setTimeout(() => {
        flippedCards.forEach((c) => c.classList.remove("flipped"));
        flippedCards.length = 0;

        chances--;
        chancesDisplay.textContent = chances;

        if (chances <= 0) {
          showGameOver();
          resetButton.addEventListener("click", () => {
            window.location.reload();
          });
          cards.forEach((c) => c.removeEventListener("click", onCardClick));
        }
      }, 300);
    }
  }
}
function showGameOver() {
  gameOver.classList.remove("hidden");
}
function checkWin() {
  let allFlipped = Array.from(cards).every((c) => c.classList.contains("flipped"));

  if (allFlipped) {
    score += 10;
    scoreDisplay.textContent = score;
    setTimeout(() => {
      showGameOver();
      resetButton.addEventListener("click", () => {
        resetGame();
        allFlipped = false;
      });
      cards.forEach((c) => c.removeEventListener("click", onCardClick));
    }, 100);
  }
}
function resetGame() {
  gameOver.classList.add("hidden");
  cards.forEach((c) => c.classList.remove("flipped"));
  flippedCards.length = 0;
  chances = 5;
  chancesDisplay.textContent = chances;
  assignLettersToCards(cardTexts, letters);

  cards.forEach((card) => {
    card.addEventListener("click", onCardClick);
  });
}

let chances = 5;
let flippedCards = [];
let chancesDisplay;
let cards;
let cardTexts;
let resetButton;
let gameOver;
let letters;
let paired = 0;
let pairedDisplay;
let score = 0;
let scoreDisplay;

document.addEventListener("DOMContentLoaded", () => {
  const gridId = "#card-grid";
  const cardCount = parseInt(document.querySelector(gridId).dataset.cardCount);

  scoreDisplay = document.getElementById("score");
  scoreDisplay.textContent = score;

  pairedDisplay = document.getElementById("paired");
  pairedDisplay.textContent = paired;

  letters = ["a", "b", "c", "d"];
  gameOver = document.getElementById("game-over");
  resetButton = document.getElementById("reset-btn");
  chancesDisplay = document.getElementById("chances");

  generateCards(gridId, cardCount);

  cards = document.querySelectorAll(".card");
  cardTexts = document.querySelectorAll(".card-text");

  assignLettersToCards(cardTexts, letters);

  chancesDisplay.textContent = chances;

  cards.forEach((card) => {
    card.addEventListener("click", onCardClick);
  });
});
