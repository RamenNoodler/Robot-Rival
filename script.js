const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");

/* =========================
   ENSURE OVERLAY IS HIDDEN INITIALLY
========================= */
document.addEventListener("DOMContentLoaded", () => {
  overlay.style.display = "none";  // Force the overlay to be hidden at load
});

/* =========================
   LOAD CARDS
========================= */
async function loadCards() {
  cardGrid.innerHTML = "";

  try {
    const indexResponse = await fetch("Cards/cards-index.json");
    const indexData = await indexResponse.json();

    for (const folderName of indexData.cards) {

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

  // Ensure the overlay is hidden at the start, then make it visible
  overlay.style.display = "flex";  // Show the overlay when opening the pop-up
  expandedCard.innerHTML = "";  // Clear any previous content in the pop-up

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
    expandedCard.innerHTML = "";  // Clear content in the popup when closed
  }
});

/* START */
loadCards();
