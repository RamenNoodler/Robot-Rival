const cardGrid = document.getElementById("card-grid");
const overlay = document.getElementById("card-overlay");
const expandedCard = document.getElementById("expanded-card");

/* Hide overlay immediately on load */
overlay.classList.remove("active");

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
   CREATE CARD
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

  expandedCard.innerHTML = "";

  const image = document.createElement("img");
  image.src = `Cards/${folderName}/${cardData.image}`;
  image.style.width = "100%";
  image.style.borderRadius = "10px";
  image.style.marginBottom = "15px";

  const title = document.createElement("h2");
  title.textContent = cardData.name;

  const description = document.createElement("p");
  description.textContent = cardData.description || "";

  expandedCard.appendChild(image);
  expandedCard.appendChild(title);
  expandedCard.appendChild(description);

  overlay.classList.add("active");
}

/* =========================
   CLOSE POPUP
========================= */
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});

/* START */
loadCards();
