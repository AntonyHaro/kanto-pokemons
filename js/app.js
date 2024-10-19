// create a html element with the pokemon's name and img
function createPokemonElement(name, img) {
    const pokemon = document.createElement("li");
    const pokemonSprite = document.createElement("img");
    const pokemonName = document.createElement("p");

    pokemonName.textContent = capitalizeFirstLetter(name);
    pokemonSprite.src = img;
    pokemonSprite.alt = `${name} image`;

    pokemon.append(pokemonName, pokemonSprite);

    return pokemon;
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

// Busca os primeiros 151 Pokémon
async function fetchPokemons() {
    const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=151";
    const pokemonsContainer = document.getElementById("pokemon-list");

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
        const pokemonElements = validPokemonData.map((pokemon, index) =>
            createPokemonElement(
                `${index + 1}. ${pokemon.name}`,
                pokemon.sprites["front_default"]
            )
        );

        // insert all the elements once
        pokemonsContainer.append(...pokemonElements);
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

fetchPokemons();
