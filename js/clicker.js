let canStart = false;
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-overlay").classList.replace("translate-y-0", "-translate-y-[200%]");
  const startTimerEvent = new Event("startTimer");
  document.dispatchEvent(startTimerEvent);
});
const finalScoreDisplay = document.getElementById("result");
function setTimer(duration, display) {
  let timer = duration;

  // Tampilkan waktu awal langsung
  let minutes = parseInt(timer / 60, 10);
  let seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  display.textContent = minutes + ":" + seconds;

  const interval = setInterval(function () {
    if (timer-- < 1) {
      clearInterval(interval);
      const event = new Event("timerEnd");
      document.dispatchEvent(event);
      return;
    }

    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
  }, 1000);
}

let timerDisplay = document.getElementById("timer");
let timer = 10;
document.addEventListener("startTimer", function () {
  setTimer(timer, timerDisplay);

  let numberToIncrease = 0;
  function increaseNumber() {
    this.textContent = numberToIncrease++;
  }
  document.getElementById("number-click").addEventListener("click", increaseNumber);

  document.addEventListener("timerEnd", function () {
    document.getElementById("score-indicator").setAttribute("style", "display:block");
    document.getElementById("reset-btn").setAttribute("style", "display:block");
    document.getElementById("result").textContent = document.getElementById("number-click").textContent;
    document.getElementById("number-click").removeEventListener("click", increaseNumber);
  });
});
function resetGame() {
  window.location.reload();
}
document.getElementById("reset-btn").addEventListener("click", resetGame);
