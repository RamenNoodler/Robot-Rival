const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");

/* Make sure overlay is hidden on load */
overlay.classList.remove("active");

/* =========================
   LOAD CARDS BASED ON TEAM
========================= */
async function loadCards(team = '') {
  cardGrid.innerHTML = "";  // Clear previous cards

  try {
    const indexResponse = await fetch("Cards/cards-index.json");
    const indexData = await indexResponse.json();

    // Filter cards by the selected team
    const filteredCards = indexData.cards.filter(card => {
      if (team === '') return true; // If no team selected, show all
      return card.team.toLowerCase() === team.toLowerCase(); // Only show cards for the selected team
    });

    for (const folderName of filteredCards) {
      const cardResponse = await fetch(`Cards/${folderName}/data.json`);
      const cardData = await cardResponse.json();

      const card = createCard(cardData, folderName);
      cardGrid.appendChild(card);
    }

  } catch (err) {
    cardGrid.innerHTML = "<h2 style='color:red;'>Failed to load cards</h2>";
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
    openPopup(cardData, folderName);
  });

  return card;
}

/* =========================
   OPEN POPUP
========================= */
function openPopup(cardData, folderName) {
  expandedCard.innerHTML = "";  // Clear the pop-up content first

  /* --- IMAGE --- */
  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "10px";
  image.style.marginBottom = "15px";

  /* --- TITLE --- */
  const title = document.createElement("h2");
  title.textContent = cardData.name;

  /* --- DESCRIPTION --- */
  const descriptionSection = document.createElement("div");
  descriptionSection.classList.add("ability-block");

  descriptionSection.innerHTML = `
    <h3>Description</h3>
    <p>${cardData.description || ""}</p>
  `;

  /* --- HP STAT --- */
  const hpSection = document.createElement("div");
  hpSection.classList.add("ability-block");

  hpSection.innerHTML = `
    <h3>HP</h3>
    <p>${cardData.hp || "No HP specified"}</p>
  `;

  /* --- ABILITIES (DYNAMIC 1–4+) --- */
  const abilitiesContainer = document.createElement("div");

  if (cardData.abilities && Array.isArray(cardData.abilities)) {

    cardData.abilities.forEach((ability, index) => {

      const abilityBlock = document.createElement("div");
      abilityBlock.classList.add("ability-block");

      abilityBlock.innerHTML = `
        <h3>Ability ${index + 1}: ${ability.name}</h3>
        <p><strong>Energy Cost:</strong> ${ability.energy}</p>
        <p>${ability.description}</p>
      `;

      abilitiesContainer.appendChild(abilityBlock);
    });
  }

  /* --- BUILD POPUP --- */
  expandedCard.appendChild(image);
  expandedCard.appendChild(title);
  expandedCard.appendChild(descriptionSection);
  expandedCard.appendChild(hpSection);  // Add HP Section
  expandedCard.appendChild(abilitiesContainer);
}

/* =========================
   CLOSE POPUP
========================= */
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";  // Hide overlay when clicking outside
    expandedCard.innerHTML = "";  // Clear the content in the pop-up when closed
  }
});

/* =========================
   CATEGORY BUTTONS (Team Selection)
========================= */
document.getElementById("teamobsidian").addEventListener("click", () => loadCards("Team Obsidian"));
document.getElementById("teamprotostar").addEventListener("click", () => loadCards("Team Protostar"));
document.getElementById("teamneutral").addEventListener("click", () => loadCards("Team Neutral"));

/* =========================
   INITIAL LOAD
========================= */
loadCards(); // Load all cards initially
