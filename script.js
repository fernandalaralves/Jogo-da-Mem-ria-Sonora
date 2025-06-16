const board = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let currentAudio = null;
let matchedPairs = 0;

// Lista atualizada de sons
const validSoundIds = [
  "sound1", "sound4", "sound5", "sound6", "sound8", "sound11", "sound13"
];

// Mapeamento de caminhos dos áudios
const soundMap = {
  sound1: "sounds/sound1.mp3",
  sound4: "sounds/sound4.mp3",
  sound5: "sounds/sound5.mp3",
  sound6: "sounds/sound6.mp3",
  sound8: "sounds/sound8.mp3",
  sound11: "sounds/sound11.mp3",
  sound13: "sounds/sound13.mp3"
};

// Criar os pares
let soundPairs = [...validSoundIds, ...validSoundIds];

// Função para embaralhar o array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  board.innerHTML = "";
  shuffle(soundPairs);
  matchedPairs = 0;
  soundPairs.forEach((sound, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.sound = sound;
    card.dataset.index = index;
    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
  });

  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function handleCardClick(e) {
  const card = e.currentTarget;

  if (lockBoard || card.classList.contains("revealed")) return;

  card.classList.add("revealed");
  playSound(card.dataset.sound);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  if (firstCard.dataset.sound === secondCard.dataset.sound) {
    matchedPairs++;
    if (matchedPairs === validSoundIds.length) {
      setTimeout(() => {
        alert("Parabéns! Você encontrou todos os pares! 🎉");
      }, 500);
    }
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  } else {
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function playSound(soundId) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const src = soundMap[soundId];
  if (!src) return;

  const audio = new Audio(src);
  currentAudio = audio;
  audio.play().catch(err => {
    console.error(`Erro ao tocar o som ${soundId}:`, err);
  });
}

resetButton.addEventListener("click", createBoard);

// Inicializar o jogo
createBoard();
