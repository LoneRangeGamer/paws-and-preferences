const NUM_CATS = 10;
const cardContainer = document.getElementById("card-container");
const summaryPanel = document.getElementById("summary");
const likeCounter = document.getElementById("like-count");
const likedGrid = document.getElementById("liked-cats");

let favorites = [];

//cat URLs
const catUrls = Array.from({ length: NUM_CATS }, (_, i) =>
  `https://cataas.com/cat?width=400&height=500&random=${i}`
);

//add cards
catUrls.reverse().forEach(createCard);

function createCard(url) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = url;
  img.alt = "Cat";

  card.appendChild(img);
  cardContainer.appendChild(card);

  enableSwipe(card, url);
}

function enableSwipe(card, url) {
  let startX = 0;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    card.style.transition = "none";
  });

  card.addEventListener("pointermove", e => {
    if (!startX) return;
    const dx = e.clientX - startX;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 15}deg)`;
  });

  card.addEventListener("pointerup", e => {
    const dx = e.clientX - startX;
    startX = 0;

    card.style.transition = "transform 0.3s ease";

    if (dx > 100) {
      favorites.push(url);
      removeCard(card, 1000);
    } else if (dx < -100) {
      removeCard(card, -1000);
    } else {
      card.style.transform = "translateX(0)";
    }
  });
}

function removeCard(card, distance) {
  card.style.transform = `translateX(${distance}px) rotate(${distance / 10}deg)`;

  setTimeout(() => {
    card.remove();
    if (!cardContainer.children.length) showSummary();
  }, 300);
}

function showSummary() {
  document.querySelector(".app-container").classList.add("hidden");
  summaryPanel.classList.remove("hidden");

  likeCounter.textContent = favorites.length;

  favorites.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    likedGrid.appendChild(img);
  });
}

//Buttons
document.getElementById("btn-like").onclick = () => {
  const card = cardContainer.lastElementChild;
  if (!card) return;
  favorites.push(card.querySelector("img").src);
  removeCard(card, 1000);
};

document.getElementById("btn-dislike").onclick = () => {
  const card = cardContainer.lastElementChild;
  if (!card) return;
  removeCard(card, -1000);
};
