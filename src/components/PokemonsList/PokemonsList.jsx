import Pokemon from "../Pokemon/Pokemon";
import styles from "./PokemonsList.module.css";

function PokemonsList({ pokemons }) {
    return (
        <ul id={styles.pokemonsContainer}>
            {pokemons.map((pokemon) => (
                <Pokemon key={pokemon.id} pokemon={pokemon} />
            ))}
        </ul>
    );
}

export default PokemonsList;
