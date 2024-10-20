import Pokemon from "./Pokemon";

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
