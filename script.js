const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");
const searchBar = document.getElementById("search-bar");

/* FORCE overlay hidden on load */
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

      // Save searchable data
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
      };

      cardGrid.appendChild(card);
    }

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

  /* IMAGE */
  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "10px";
  image.style.marginBottom = "15px";

  /* TITLE */
  const title = document.createElement("h2");
  title.textContent = cardData.name;

  /* HP */
  const hp = document.createElement("p");
  hp.innerHTML = `<strong>HP:</strong> ${cardData.hp || "—"}`;

  /* DESCRIPTION */
  const description = document.createElement("p");
  description.style.whiteSpace = "pre-line";
  description.textContent = cardData.description || "";

  expandedCard.appendChild(image);
  expandedCard.appendChild(title);
  expandedCard.appendChild(hp);
  expandedCard.appendChild(description);

  /* ABILITIES */
  if (cardData.abilities && Array.isArray(cardData.abilities)) {
    cardData.abilities.forEach((ability) => {

      const abilityBlock = document.createElement("div");
      abilityBlock.style.marginTop = "15px";

      abilityBlock.innerHTML = `
        <h3>${ability.name}</h3>
        <p><strong>Energy:</strong> ${ability.energy}</p>
        <p style="white-space: pre-line;">${ability.description}</p>
      `;

      expandedCard.appendChild(abilityBlock);
    });
  }
}

/* =========================
   CLOSE POPUP
========================= */
overlay.onclick = function (e) {
  if (e.target === overlay) {
    overlay.style.display = "none";
    expandedCard.innerHTML = "";
  }
};

/* =========================
   SEARCH FUNCTION
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

/* START APP */
loadCards();
