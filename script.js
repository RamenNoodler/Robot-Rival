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
  cardGrid.innerHTML = "";

  try {
    const response = await fetch("Cards/cards-index.json");
    const cardFolders = await response.json();

    for (const folderName of cardFolders) {

      const cardResponse = await fetch(`Cards/${folderName}/data.json`);
      const cardData = await cardResponse.json();

      const card = document.createElement("div");
      card.className = "card";

      card.dataset.name = cardData.name.toLowerCase();
      card.dataset.description = (cardData.description || "").toLowerCase();

      const img = document.createElement("img");
      img.src = `Cards/${folderName}/${cardData.image}`;
      img.alt = cardData.name;

      const name = document.createElement("h3");
      name.textContent = cardData.name;

      card.appendChild(img);
      card.appendChild(name);

      card.onclick = function () {
        openPopup(cardData, folderName);

        const newURL =
          window.location.origin +
          window.location.pathname +
          "?card=" + folderName;

        window.history.pushState({ path: newURL }, "", newURL);
      };

      cardGrid.appendChild(card);
    }

    checkURLForCard(cardFolders);

  } catch (err) {
    cardGrid.innerHTML = "<h2 style='color:red;'>Failed to load cards</h2>";
  }
}

/* =========================
   OPEN POPUP
========================= */
function openPopup(cardData, folderName) {

  expandedCard.innerHTML = "";
  overlay.style.display = "flex";

  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "12px";
  image.style.marginBottom = "15px";

  const title = document.createElement("h2");
  title.textContent = cardData.name;

  const hp = document.createElement("p");
  hp.innerHTML = `<strong>HP:</strong> ${cardData.hp || "—"}`;

  const description = document.createElement("p");
  description.style.whiteSpace = "pre-line";
  description.textContent = cardData.description || "";

  expandedCard.appendChild(image);
  expandedCard.appendChild(title);
  expandedCard.appendChild(hp);

  /* 🔥 Only show abilities if they actually exist AND have items */
  if (cardData.abilities && Array.isArray(cardData.abilities) && cardData.abilities.length > 0) {

    const abilityDivider = document.createElement("hr");
    expandedCard.appendChild(abilityDivider);

    cardData.abilities.forEach((ability) => {

      const abilityBlock = document.createElement("div");
      abilityBlock.style.marginTop = "15px";

      abilityBlock.innerHTML = `
        <h3>${ability.name}</h3>
        <p style="white-space: pre-line;">${ability.description}</p>
      `;

      expandedCard.appendChild(abilityBlock);
    });

    const descDivider = document.createElement("hr");
    expandedCard.appendChild(descDivider);
  }

  /* Description always appears */
  expandedCard.appendChild(description);
}

/* =========================
   CLOSE POPUP
========================= */
overlay.onclick = function (e) {
  if (e.target === overlay) {
    overlay.style.display = "none";
    expandedCard.innerHTML = "";

    window.history.pushState(
      {},
      "",
      window.location.origin + window.location.pathname
    );
  }
};

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
