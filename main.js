const charactersList = document.getElementById("charactersList");
const searchCharactersByName = document.getElementById(
  "searchCharactersByName"
);
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
let response;
let currentPage = 1;
let isLoading = false;

async function loadCharacters(page = 1, name = "") {
  try {
    isLoading = true;
    const params = {
      name,
      page,
    };
    response = await api.get("/character", { params });
    prevPage.disabled = true;
    nextPage.disabled = true;
    charactersList.innerHTML = "";

    console.log(response.data);

    response.data.results.forEach((character) => {
      const characterCard = document.createElement("div");
      characterCard.classList.add("characters-card");

      const characterImage = document.createElement("img");
      characterImage.classList.add("characters-image");
      characterImage.src = character.image;

      const statusClass =
        character.status === "Alive" ? "status-alive" : "status-dead";

      const characterName = document.createElement("h2");
      characterName.textContent = character.name;
      characterName.classList.add(statusClass);

      characterCard.appendChild(characterImage);
      characterCard.appendChild(characterName);
      charactersList.appendChild(characterCard);
    });

    prevPage.disabled = !response.data.info.prev;
    nextPage.disabled = !response.data.info.next;
  } catch (error) {
    console.log("Erro ao buscar personagens.", error);
  } finally {
    isLoading = false;
  }
}

loadCharacters();

searchCharactersByName.addEventListener("input", () => {
  currentPage = 1;
  loadCharacters(currentPage, searchCharactersByName.value);
});

prevPage.addEventListener("click", () => {
  if (currentPage > 1 && !isLoading) {
    currentPage--;
    loadCharacters(currentPage);
  }
});

nextPage.addEventListener("click", () => {
  if (currentPage < response.data.info.pages && !isLoading) {
    currentPage++;
    loadCharacters(currentPage);
  }
});
