const goBtn = document.querySelector("#goBtn");
let personName = document.querySelector("#name");

if (goBtn) {
  goBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (!personName.value) {
      alert("Vänligen skriv ditt namn för att kunna gå vidare!");
    }
    if (personName.value) {
      localStorage.setItem("person", JSON.stringify(personName.value));
      window.location.href = "player.html";
    }
  });
}

const displayName = document.querySelector("#displayName");
let currentName = JSON.parse(localStorage.getItem("person"));
if (displayName) {
  displayName.innerHTML = `Välkommen ${currentName} !`;
}

const cards = document.querySelectorAll(".memory-card");

const logout = document.querySelector("#logout");
if (logout) {
  logout.addEventListener("click", function () {
    localStorage.clear();
    window.location.href = "index.html";
  });
}
let timeList = [];

const startCounter = () => {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 30 ? "0" + seconds : seconds;
  document.querySelector("#counter").innerHTML = ` ${minutes} :  ${seconds} `;
  time++;
};

let startTime = 0;
let time = startTime * 60;

// let timmer;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) {
    return;
  }

  this.classList.add("flip");

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    startTime = setInterval(startCounter, 1000);
    return;
  }

  // second click
  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    let result = `Ditt svar: ${firstCard.dataset.framework} = ${secondCard.dataset.framework}`;
    timeList.push(result);
    if (timeList.length == 6) {
      let newResults = {
        startTime: startTime,
        date: new Date().toLocaleTimeString(),
      };
      timeList.push(newResults);
      localStorage.setItem("key", JSON.stringify(timeList));
      window.location.reload();
      // alert("Yes, you win!");
    }
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

const getScors = () => {
  const data = JSON.parse(localStorage.getItem("key"));
  if (data) {
    const scors = [...data];
    // scors.join(" ");

    const list = document.querySelector(".list-group");
    const h3 = document.createElement("h3");
    scors.forEach((score) => {
      let countResult = JSON.stringify(score.startTime);
      h3.classList.add("list-group-item");
      h3.style.marginTop = "2rem";
      if (countResult >= 60) {
        h3.innerHTML = `${countResult} minuter`;
      } else {
        h3.innerHTML = `${countResult} sekunder`;
      }
      list.appendChild(h3);
    });
  }
};

getScors();
