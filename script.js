/* =========================
   ELEMENT REFERENCES
========================= */

const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");
const searchBar = document.getElementById("search-bar");


/* =========================
   FORCE HIDE POPUP ON LOAD
========================= */

window.addEventListener("DOMContentLoaded", () => {
  overlay.style.display = "none";
  expandedCard.innerHTML = "";
});


/* =========================
   LOAD CARDS
========================= */

async function loadCards() {

  cardGrid.innerHTML = "";

  try {
    const response = await fetch("./Cards/cards-index.json?v=" + Date.now());
    const cardFolders = await response.json();

    for (const folderName of cardFolders) {

      const cardResponse = await fetch(`./Cards/${folderName}/data.json?v=${Date.now()}`);
      const cardData = await cardResponse.json();

      const card = document.createElement("div");
      card.className = "card";

      card.dataset.name = (cardData.name || "").toLowerCase();
      card.dataset.description = (cardData.description || "").toLowerCase();

      const img = document.createElement("img");
      img.src = `./Cards/${folderName}/${cardData.image}`;
      img.alt = cardData.name;

      const name = document.createElement("h3");
      name.textContent = cardData.name;

      card.appendChild(img);
      card.appendChild(name);

      card.onclick = function () {
        openPopup(cardData, folderName);
      };

      cardGrid.appendChild(card);
    }

  } catch (err) {
    console.error("Card loading error:", err);
  }
}


/* =========================
   OPEN POPUP
========================= */

function openPopup(cardData, folderName) {

  expandedCard.innerHTML = "";
  overlay.style.display = "flex";

  // IMAGE
  if (cardData.image) {
    const image = document.createElement("img");
    image.src = `./Cards/${folderName}/${cardData.image}`;
    image.alt = cardData.name;
    expandedCard.appendChild(image);
  }

  // NAME
  if (cardData.name) {
    const title = document.createElement("h2");
    title.textContent = cardData.name;
    expandedCard.appendChild(title);
  }

  // TEAM
  if (cardData.team) {
    const team = document.createElement("p");
    team.innerHTML = `<strong>Team:</strong> ${cardData.team}`;
    expandedCard.appendChild(team);
  }

  // HP
  if (cardData.hp !== undefined) {
    const hp = document.createElement("p");
    hp.innerHTML = `<strong>HP:</strong> ${cardData.hp}`;
    expandedCard.appendChild(hp);
  }

  // ABILITIES
  if (Array.isArray(cardData.abilities) && cardData.abilities.length > 0) {

    expandedCard.appendChild(document.createElement("hr"));

    cardData.abilities.forEach(ability => {

      const abilityBlock = document.createElement("div");

      const abilityName = document.createElement("h3");
      abilityName.textContent = ability.name || "";

      const abilityDesc = document.createElement("p");
      abilityDesc.style.whiteSpace = "pre-line";
      abilityDesc.textContent = ability.description || "";

      abilityBlock.appendChild(abilityName);
      abilityBlock.appendChild(abilityDesc);

      expandedCard.appendChild(abilityBlock);
    });

    expandedCard.appendChild(document.createElement("hr"));
  }

  // DESCRIPTION
  if (cardData.description) {
    const description = document.createElement("p");
    description.style.whiteSpace = "pre-line";
    description.textContent = cardData.description;
    expandedCard.appendChild(description);
  }
}


/* =========================
   CLOSE POPUP
========================= */

function closePopup() {
  overlay.style.display = "none";
  expandedCard.innerHTML = "";
}

overlay.addEventListener("click", function (e) {
  if (e.target === overlay) {
    closePopup();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closePopup();
  }
});


/* =========================
   SEARCH FUNCTION
========================= */

searchBar.addEventListener("input", function () {

  const value = searchBar.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {

    const nameMatch = card.dataset.name.includes(value);
    const descMatch = card.dataset.description.includes(value);

    card.style.display = (nameMatch || descMatch) ? "block" : "none";
  });

});


/* =========================
   START
========================= */

loadCards();
