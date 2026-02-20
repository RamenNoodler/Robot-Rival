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
  try {
    const indexRes = await fetch("cards/cards-index.json");
    const cardIndex = await indexRes.json();

    // Build array of promises (parallel loading)
    const cardPromises = cardIndex.map(card =>
      fetch(card.path)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load ${card.path}`);
          return res.json();
        })
        .then(data => ({
          ...data,
          id: card.id,
          team: card.team
        }))
    );

    // Wait for ALL cards at once
    const cards = await Promise.all(cardPromises);

    return cards;

  } catch (error) {
    console.error("Error loading cards:", error);
    return [];
  }
}

/* =========================
   OPEN POPUP
========================= */

function openPopup(cardData, folderName) {

  expandedCard.innerHTML = "Hey, your not supposed to see this >:(";
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
