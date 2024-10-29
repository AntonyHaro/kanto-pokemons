import Pokemon from "../Pokemon/Pokemon";
import styles from "./PokemonsList.module.css";

function PokemonsList({ pokemons }) {
    return (
        <ul id={styles.pokemonsContainer}>
            {pokemons.map((pokemon) => (
                <Pokemon key={pokemon.id} pokemon={pokemon} />
            ))}
            {pokemons.length == 0 && <p>No Pokemon of this type were found</p>}
        </ul>
    );
}

export default PokemonsList;
