// create a html element with the pokemon's name and img
function createPokemonElement(pokemon) {
    const types = pokemon.types
        .map((item) => capitalizeFirstLetter(item.type.name))
        .join(", ");

    const pokemonElement = document.createElement("li");
    const pokemonName = document.createElement("p");
    pokemonName.className = "name";
    const pokemonSprite = document.createElement("img");
    const pokemonTypes = document.createElement("p");

    pokemonName.textContent = `${pokemon.id}. ${capitalizeFirstLetter(
        pokemon.name
    )}`;

    pokemonSprite.src = pokemon.sprites["front_default"];
    pokemonSprite.alt = `${pokemon.name} image`;
    pokemonTypes.textContent = types;

    pokemonElement.append(pokemonName, pokemonTypes, pokemonSprite);

    return pokemonElement;
}

// fetch the pokemon details from the url
async function fetchPokemon(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro na requisição");
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        return null;
    }
}

// fetch the first 151 pokemons (kanto)
async function fetchPokemons() {
    const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=151";
    const pokemonsContainer = document.getElementById("pokemons-container");

    const loader = document.getElementById("loader");
    loader.style.display = "block";

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Erro ao buscar lista de Pokémon");
        const data = await response.json();
        const pokemons = data.results;

        // use the Promise.all to get all pokemons
        const pokemonPromises = pokemons.map((item) => fetchPokemon(item.url));
        const pokemonData = await Promise.all(pokemonPromises);

        // filter valid results
        const validPokemonData = pokemonData.filter(
            (pokemon) => pokemon !== null
        );

        // create all the elements
        const pokemonElements = validPokemonData.map((pokemon) =>
            createPokemonElement(pokemon)
        );

        // insert all the elements once
        pokemonsContainer.append(...pokemonElements);
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
    } finally {
        loader.style.display = "none";
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ableToggleTheme(themeToggleButton) {
    // get the saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDarkMode = savedTheme === "dark";

    document.body.classList.toggle("dark-mode", isDarkMode);
    themeToggleButton.textContent = isDarkMode ? "🌞" : "🌙";

    // add the click event to change the theme
    themeToggleButton.addEventListener("click", () => {
        const isCurrentlyLightMode =
            document.body.classList.toggle("dark-mode");
        themeToggleButton.textContent = isCurrentlyLightMode ? "🌞" : "🌙";
        localStorage.setItem("theme", isCurrentlyLightMode ? "dark" : "light");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleButton = document.getElementById("theme-toggle");
    ableToggleTheme(themeToggleButton);

    fetchPokemons();
});
