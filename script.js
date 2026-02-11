const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");

/* Load all cards */
async function loadCards() {
  try {
    const indexResponse = await fetch("Cards/cards-index.json");
    const indexData = await indexResponse.json();

    const cardNames = indexData.cards;

    let rowIndex = 0;
    let colIndex = 0;
    const columns = 4;

    for (let i = 0; i < cardNames.length; i++) {
      const cardName = cardNames[i];

      const cardResponse = await fetch(`Cards/${cardName}/data.json`);
      const cardData = await cardResponse.json();

      const cardElement = createCard(cardData, cardName);

      /* Snake pattern logic */
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

/* Create a card tile */
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

  card.addEventListener("click", () => openExpandedCard(cardData, folderName));

  return card;
}

/* Open zoomed card */
function openExpandedCard(cardData, folderName) {
  expandedCard.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = cardData.name;

  const divider = document.createElement("hr");

  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "8px";
  image.style.marginBottom = "15px";

  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats");

  for (const stat in cardData.stats) {
    const statBox = document.createElement("div");
    statBox.classList.add("stat-rect");
    statBox.innerHTML = `<span>${stat.toUpperCase()}</span>: ${cardData.stats[stat]}`;
    statsContainer.appendChild(statBox);
  }

  const abilitySection = document.createElement("div");
  abilitySection.classList.add("ability");

  abilitySection.innerHTML = `
    <h3>${cardData.ability.name}</h3>
    <p><strong>Energy Cost:</strong> ${cardData.ability.energy}</p>
    <p>${cardData.ability.description}</p>
  `;

  expandedCard.appendChild(title);
  expandedCard.appendChild(image);
  expandedCard.appendChild(divider);
  expandedCard.appendChild(statsContainer);
  expandedCard.appendChild(abilitySection);

  overlay.classList.remove("hidden");
  overlay.classList.add("visible");
}

/* Close zoom when clicking outside */
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("visible");
    overlay.classList.add("hidden");
  }
});

/* Start app */
loadCards();
