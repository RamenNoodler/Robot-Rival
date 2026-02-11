const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");


/* =========================
   LOAD ALL CARDS
========================= */
async function loadCards() {
document.getElementById("card-overlay").style.display = "flex";  // Force the pop-up to show immediately
  cardGrid.innerHTML = "<h2>Loading cards...</h2>";

  try {
    const indexResponse = await fetch("Cards/cards-index.json");

    if (!indexResponse.ok) {
      throw new Error("cards-index.json not found");
    }

    const indexData = await indexResponse.json();

    const cardNames = indexData.cards;

    if (!cardNames || cardNames.length === 0) {
      cardGrid.innerHTML = "<h2>No cards listed in cards-index.json</h2>";
      return;
    }

    cardGrid.innerHTML = "";

    let rowIndex = 0;
    let colIndex = 0;
    const columns = 4;

    for (let i = 0; i < cardNames.length; i++) {

      const folderName = cardNames[i];

      const cardResponse = await fetch(`Cards/${folderName}/data.json`);

      if (!cardResponse.ok) {
        throw new Error(`Missing data.json in ${folderName}`);
      }

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
    cardGrid.innerHTML = `
      <div style="color:red; padding:20px;">
        <h2>Failed to load cards ❌</h2>
        <p>${err.message}</p>
        <p>Check folder names and capitalization.</p>
      </div>
    `;
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

  const title = document.createElement("h2");
  title.textContent = cardData.name;

  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "8px";
  image.style.marginBottom = "15px";

  const divider = document.createElement("hr");

  /* Stats */
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats");

  if (cardData.stats) {
    for (const stat in cardData.stats) {
      const statBox = document.createElement("div");
      statBox.classList.add("stat-rect");
      statBox.innerHTML = `<strong>${stat.toUpperCase()}</strong>: ${cardData.stats[stat]}`;
      statsContainer.appendChild(statBox);
    }
  }

  /* Abilities (now dynamic for any number of abilities) */
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

  /* Description */
  const description = document.createElement("div");
  description.classList.add("ability");
  description.innerHTML = `
    <h3>Description</h3>
    <p>${cardData.description || ""}</p>
  `;

  expandedCard.appendChild(title);
  expandedCard.appendChild(image);
  expandedCard.appendChild(statsContainer);
  expandedCard.appendChild(abilitySection);
  expandedCard.appendChild(description);

  // Hard code to make overlay visible (force the pop-up to show)
  overlay.style.display = "flex";
}

/* =========================
   CLOSE POPUP
========================= */
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";  // Hide the overlay when clicking outside
  }
});

/* =========================
   START APP
========================= */
loadCards();
