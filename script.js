const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");
const searchBar = document.getElementById("search-bar");

/* Hide popup on load */
overlay.style.display = "none";

/* =========================
   LOAD CARDS
========================= */
async function loadCards() {
  console.log("Loading cards...");

  cardGrid.innerHTML = "";

  try {
    const response = await fetch("Cards/cards-index.json?v=" + Date.now());
    
    if (!response.ok) {
      throw new Error("cards-index.json not found");
    }

    const cardFolders = await response.json();

    console.log("Folders found:", cardFolders);

    for (const folderName of cardFolders) {

      const cardResponse = await fetch(
        `Cards/${folderName}/data.json?v=${Date.now()}`
      );

      if (!cardResponse.ok) {
        console.warn(`Missing data.json for ${folderName}`);
        continue;
      }

      const cardData = await cardResponse.json();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="Cards/${folderName}/${cardData.image}" />
        <h3>${cardData.name}</h3>
      `;

      cardGrid.appendChild(card);
    }

    console.log("Cards loaded successfully");

  } catch (err) {
    console.error("ERROR LOADING CARDS:", err);
  }
}


/* =========================
   OPEN POPUP
========================= */
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");

/* =========================
   OPEN POPUP
========================= */
function openPopup(cardData, folderName) {

  const overlay = document.getElementById("card-overlay");
  const expandedCard = document.getElementById("expanded-card");

  // Hard reset
  expandedCard.innerHTML = "";
  overlay.style.display = "flex";

  // IMAGE
  const image = document.createElement("img");
  image.src = `./Cards/${folderName}/${cardData.image}`;
  image.alt = cardData.name;
  expandedCard.appendChild(image);

  // TITLE
  const title = document.createElement("h2");
  title.textContent = cardData.name;
  expandedCard.appendChild(title);

  // TEAM
  const team = document.createElement("p");
  team.innerHTML = `<strong>Team:</strong> ${cardData.team}`;
  expandedCard.appendChild(team);

  // HP
  const hp = document.createElement("p");
  hp.innerHTML = `<strong>HP:</strong> ${cardData.hp}`;
  expandedCard.appendChild(hp);

  // ABILITIES
  if (Array.isArray(cardData.abilities) && cardData.abilities.length > 0) {

    expandedCard.appendChild(document.createElement("hr"));

    cardData.abilities.forEach(ability => {

      const abilityBlock = document.createElement("div");

      const abilityName = document.createElement("h3");
      abilityName.textContent = ability.name;

      const abilityDesc = document.createElement("p");
      abilityDesc.style.whiteSpace = "pre-line";
      abilityDesc.textContent = ability.description;

      abilityBlock.appendChild(abilityName);
      abilityBlock.appendChild(abilityDesc);

      expandedCard.appendChild(abilityBlock);
    });

    expandedCard.appendChild(document.createElement("hr"));
  }

  // DESCRIPTION
  const description = document.createElement("p");
  description.style.whiteSpace = "pre-line";
  description.textContent = cardData.description;
  expandedCard.appendChild(description);
}

/* =========================
   CLOSE POPUP (click outside)
========================= */
overlay.addEventListener("click", function (e) {
  if (e.target === overlay) {
    closePopup();
  }
});

/* =========================
   CLOSE POPUP (ESC key)
========================= */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closePopup();
  }
});

function closePopup() {
  overlay.classList.remove("active");
  expandedCard.innerHTML = "";
  window.history.pushState({}, "", window.location.pathname);
}

/* =========================
   SEARCH
========================= */
searchBar.addEventListener("input", function () {

  const searchValue = searchBar.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {

    const nameMatch = card.dataset.name.includes(searchValue);
    const descMatch = card.dataset.description.includes(searchValue);

    if (nameMatch || descMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });
});

/* =========================
   CHECK URL ON LOAD
========================= */
async function checkURLForCard(cardFolders) {

  const params = new URLSearchParams(window.location.search);
  const cardParam = params.get("card");

  if (!cardParam) return;
  if (!cardFolders.includes(cardParam)) return;

  try {
    const cardResponse = await fetch(`Cards/${cardParam}/data.json`);
    const cardData = await cardResponse.json();

    openPopup(cardData, cardParam);

  } catch (err) {
    console.error("Failed to load card from URL");
  }
}

/* START */
loadCards();
