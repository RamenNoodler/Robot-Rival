const cardGrid = document.getElementById("cardGrid");
const cardDetail = document.getElementById("cardDetail");

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

/* Create card tile */
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

  card.addEventListener("click", () => openCardDetail(cardData, folderName));

  return card;
}

/* Open full-page detail */
function openCardDetail(cardData, folderName) {
  cardGrid.style.display = "none";
  cardDetail.classList.remove("hidden");

  document.getElementById("detailImage").src =
    `Cards/${folderName}/${cardData.image}`;

  document.getElementById("detailSPD").textContent =
    cardData.stats.spd || "-";
  document.getElementById("detailATK").textContent =
    cardData.stats.atk || "-";
  document.getElementById("detailDEF").textContent =
    cardData.stats.def || "-";
  document.getElementById("detailHP").textContent =
    cardData.stats.hp || "-";

  document.getElementById("ability1Name").textContent =
    cardData.abilities?.[0]?.name || "";
  document.getElementById("ability1Energy").textContent =
    cardData.abilities?.[0]?.energy || "";
  document.getElementById("ability1Desc").textContent =
    cardData.abilities?.[0]?.description || "";

  document.getElementById("ability2Name").textContent =
    cardData.abilities?.[1]?.name || "";
  document.getElementById("ability2Energy").textContent =
    cardData.abilities?.[1]?.energy || "";
  document.getElementById("ability2Desc").textContent =
    cardData.abilities?.[1]?.description || "";

  document.getElementById("detailDescription").textContent =
    cardData.description || "";
}

/* Back to grid */
function closeDetail() {
  cardDetail.classList.add("hidden");
  cardGrid.style.display = "grid";
}

/* Start app */
loadCards();
