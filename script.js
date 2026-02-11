const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");

/* =========================
   LOAD ALL CARDS
========================= */
async function loadCards() {
  try {
    const indexResponse = await fetch("Cards/cards-index.json");
    const indexData = await indexResponse.json();

    const cardNames = indexData.cards;

    let rowIndex = 0;
    let colIndex = 0;
    const columns = 4;

    for (let i = 0; i < cardNames.length; i++) {
      const folderName = cardNames[i];

      const cardResponse = await fetch(`Cards/${folderName}/data.json`);
      const cardData = await cardResponse.json();

      const cardElement = createCard(cardData, folderName);

      /* Snake pattern layout */
      if (rowIndex % 2 === 1) {
        cardElement.style.gridColumn = columns - colIndex;
      } else {
        cardElement.style.gridColumn = colIndex + 1;
      }

      cardGrid.appendChild(cardElement);

      colIndex++;
      if (colIndex >= columns) {
        colIndex = 0;
        rowIndex++;
      }
    }

  } catch (err) {
    console.error("Failed to load cards:", err);
  }
}

/* =========================
   CREATE CARD TILE
========================= */
function createCard(cardData, folderName) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = `Cards/${folderName}/${cardData.image}`;
  img.alt = cardData.name;

  const name = document.createElement("h3");
  name.textContent = cardData.name;

  card.appendChild(img);
  card.appendChild(name);

  card.addEventListener("click", () => {
    openExpandedCard(cardData, folderName);
  });

  return card;
}

/* =========================
   OPEN POPUP
========================= */
function openExpandedCard(cardData, folderName) {

  expandedCard.innerHTML = "";

  /* Title */
  const title = document.createElement("h2");
  title.textContent = cardData.name;

  /* Image */
  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "8px";
  image.style.marginBottom = "15px";

  /* Divider */
  const divider = document.createElement("hr");

  /* Stats Section */
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats");

  for (const stat in cardData.stats) {
    const statBox = document.createElement("div");
    statBox.classList.add("stat-rect");
    statBox.innerHTML = `<strong>${stat.toUpperCase()}</strong>: ${cardData.stats[stat]}`;
    statsContainer.appendChild(statBox);
  }

  /* Abilities Section */
  const abilitySection = document.createElement("div");

  if (cardData.abilities && Array.isArray(cardData.abilities)) {
    cardData.abilities.forEach(ability => {
      const abilityBox = document.createElement("div");
      abilityBox.classList.add("ability");

      abilityBox.innerHTML = `
        <h3>${ability.name}</h3>
        <p><strong>Energy Cost:</strong> ${ability.energy}</p>
        <p>${ability.description}</p>
      `;

      abilitySection.appendChild(abilityBox);
    });
  }

  /* Description Section */
  const description = document.createElement("div");
  description.classList.add("ability");
  description.innerHTML = `
    <h3>Description</h3>
    <p>${cardData.description || ""}</p>
  `;

  /* Append Everything */
  expandedCard.appendChild(title);
  expandedCard.appendChild(image);
  expandedCard.appendChild(divider);
  expandedCard.appendChild(statsContainer);
  expandedCard.appendChild(abilitySection);
  expandedCard.appendChild(description);

  overlay.classList.remove("hidden");
}

/* =========================
   CLOSE POPUP
========================= */
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});

/* =========================
   START APP
========================= */
loadCards();
