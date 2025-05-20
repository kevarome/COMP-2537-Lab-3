console.log("js file loaded");

// Set initial offset
let offset = 0;

// Number of Pokémon to load per request
const limit = 10;

// Prevents multiple loads at once
let loading = false;

// Function to load a batch of Pokémon
async function loadPokemon() {
    try {
        // Artificial delay for testing spinner
        await new Promise(res => setTimeout(res, 1000)); // 700ms delay

        // Fetch a batch of Pokémon (basic info with names and URLs)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const jsonObj = await response.json();
        const results = jsonObj.results;

        // Loop through each Pokémon in the batch
        for (let poke of results) {
            // Fetch detailed info about each Pokémon using its unique URL
            const detailsResponse = await fetch(poke.url);
            const details = await detailsResponse.json();

            // Extract the official artwork URL
            const imageUrl = details.sprites.other['official-artwork'].front_shiny;
            const name = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);

            // Clone the template from index.ejs
            const template = document.getElementById("pokemonTemplate");
            const newCard = template.cloneNode(true);
            newCard.classList.remove("d-none"); // Show it
            newCard.removeAttribute("id"); //Remove the 'id' so there aren't multiple elements with the same ID

            // Fill in data
            newCard.querySelector(".card-img-top").src = imageUrl; //get the image
            newCard.querySelector(".card-img-top").alt = name; //alt name
            newCard.querySelector(".card-title").textContent = name; //pokemon name

            //Append/add the new card to list
            document.getElementById("pokemonList").appendChild(newCard);
        }

        offset += limit;
    } catch (error) {
        console.error("Error loading Pokémon:", error);
    }
}

// Show/hide spinner helpers
function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}
function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

// Modified loadPokemon to handle loading state and spinner
async function loadPokemonWithSpinner() {
    if (loading) return;
    loading = true;
    showSpinner();
    try {
        await loadPokemon();
    } finally {
        hideSpinner();
        loading = false;
    }
}

// Load More button event and initial load
document.addEventListener("DOMContentLoaded", () => {
    // Initial load
    loadPokemonWithSpinner();

    const btn = document.getElementById("loadMoreBtn");
    if (btn) {
        btn.addEventListener("click", loadPokemonWithSpinner);
    }
});

// Remove infinite scroll if you only want button loading
window.removeEventListener("scroll", () => {}); // Optional: disables infinite scroll
