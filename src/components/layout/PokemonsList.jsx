import Pokemon from "./Pokemon";

import "./PokemonsList.css"

function PokemonsList({ pokemons }) {
    return (
        <ul id="pokemons-container">
            {pokemons.map((pokemon) => (
                <Pokemon key={pokemon.id} pokemon={pokemon} />
            ))}
        </ul>
    );
}

export default PokemonsList;
