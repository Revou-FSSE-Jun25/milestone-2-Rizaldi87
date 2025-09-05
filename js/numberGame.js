const randomNumber = Math.floor(Math.random() * 100);
console.log("Secret Number (for testing):", randomNumber);
let playerChances = 5;
let canAnswer = true;
document.getElementById("chances").textContent = playerChances;

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-overlay").classList.replace("translate-y-0", "-translate-y-[200%]");
});

document.getElementById("guess-btn").addEventListener("click", function (e) {
  e.preventDefault();
  if (!canAnswer) return;

  let playerAnswer = Number(document.getElementById("answer").value);
  let response = "";

  if (playerAnswer === randomNumber) {
    response = "🎉 You're Right!!!";
    revealCorrectNumber();
  } else {
    playerChances--;
    document.getElementById("chances").textContent = playerChances;

    if (playerChances <= 0) {
      document.getElementById("guess-response").textContent = "💀 You Lose!!!";
      revealCorrectNumber();
      return;
    }

    if (playerAnswer > randomNumber + 5) {
      response = "⬆️ Too High";
    } else if (playerAnswer < randomNumber - 5) {
      response = "⬇️ Too Low";
    } else if (playerAnswer > randomNumber) {
      response = "🔼 Little Bit Too High";
    } else {
      response = "🔽 Little Bit Too Low";
    }
  }

  document.getElementById("guess-form").reset();
  document.getElementById("guess-response").textContent = response;
});

function revealCorrectNumber() {
  document.getElementById("random-number").innerText = randomNumber;
  document.getElementById("reset-btn").classList.remove("hidden");
  canAnswer = false;
}
