function openPopup(cardData, folderName) {

  expandedCard.innerHTML = "";

  // 🔥 SHOW THE POPUP
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

  /* ABILITIES */
  const abilitiesContainer = document.createElement("div");

  if (cardData.abilities && Array.isArray(cardData.abilities)) {
    cardData.abilities.forEach((ability, index) => {

      const abilityBlock = document.createElement("div");
      abilityBlock.style.marginTop = "15px";

      abilityBlock.innerHTML = `
        <h3>${ability.name}</h3>
        <p><strong>Energy:</strong> ${ability.energy}</p>
        <p style="white-space: pre-line;">${ability.description}</p>
      `;

      abilitiesContainer.appendChild(abilityBlock);
    });
  }

  expandedCard.appendChild(image);
  expandedCard.appendChild(title);
  expandedCard.appendChild(hp);
  expandedCard.appendChild(description);
  expandedCard.appendChild(abilitiesContainer);
}
