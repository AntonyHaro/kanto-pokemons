import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/utils";
import colors from "../../constants/colors";
import styles from "./PokemonsList.module.css";

function PokemonsList({
    pokemons,
    isComparatorOpen,
    onSelect,
    selectedPokemons,
}) {
    return (
        <ul id={styles.pokemonsContainer}>
            {pokemons.map((pokemon) => (
                <Pokemon
                    key={pokemon.id}
                    pokemon={pokemon}
                    isComparatorOpen={isComparatorOpen}
                    onSelect={onSelect}
                    selectedPokemons={selectedPokemons}
                />
            ))}
            {pokemons.length == 0 && (
                <p className={styles.noPokemons}>
                    No Pokemon of this type were found
                </p>
            )}
        </ul>
    );
}

export default PokemonsList;

function Pokemon({ pokemon, isComparatorOpen, onSelect, selectedPokemons }) {
    const navigate = useNavigate();

    let isSelected;

    selectedPokemons
        ? (isSelected = selectedPokemons.some(
              (selected) => selected.id === pokemon.id
          ))
        : "";

    const playSound = async (id) => {
        const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
        try {
            const audio = new Audio(soundUrl);
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    const handleClick = () => {
        if (!isComparatorOpen) {
            playSound(pokemon.id);
            navigate(`/pokemon/${pokemon.id}`);
            return;
        }
        onSelect(pokemon);
    };

    const firstType =
        pokemon.types && pokemon.types[0] ? pokemon.types[0].type.name : null;

    return (
        <li
            className={`${styles.pokemonCard} ${
                isSelected ? styles.selected : ""
            }`}
            onClick={handleClick}
        >
            <div className={styles.textContainer}>
                <p className={styles.id}>
                    #{String(pokemon.id).padStart(3, "0")}
                </p>
                <div className={styles.nameContainer}>
                    <p className={styles.name}>
                        {capitalizeFirstLetter(pokemon.name)}
                    </p>
                </div>
                <div className={styles.typesContainer}>
                    {pokemon.types.map((type, index) => (
                        <p
                            key={index}
                            className={styles.type}
                            style={{
                                backgroundColor: colors[type.type.name] || "",
                            }}
                        >
                            {capitalizeFirstLetter(type.type.name)}
                        </p>
                    ))}
                </div>
            </div>
            <div
                className={styles.imgContainer}
                style={{
                    backgroundColor: firstType ? colors[firstType] : "",
                }}
            >
                <img
                    src={pokemon.sprites["front_default"]}
                    alt={pokemon.name}
                />
            </div>
        </li>
    );
}
