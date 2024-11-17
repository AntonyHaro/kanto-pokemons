import { useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import styles from "./PokemonsList.module.css";

function PokemonsList({ pokemons }) {
    console.log(pokemons);

    return (
        <ul id={styles.pokemonsContainer}>
            {pokemons.map((pokemon) => (
                <Pokemon key={pokemon.id} pokemon={pokemon} />
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

function Pokemon({ pokemon }) {
    const navigate = useNavigate();

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const playSound = async (id) => {
        const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
        try {
            const audio = new Audio(soundUrl);
            await audio
                .play()
                .catch((err) => console.error("Playback failed:", err));
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    const handleClick = () => {
        playSound(pokemon.id);
        navigate(`/pokemon/${pokemon.id}`);
    };

    const firstType =
        pokemon.types && pokemon.types[0] ? pokemon.types[0].type.name : null;

    return (
        // <li
            // style={{
            //     backgroundColor: firstType ? colors[firstType] : "",
            // }}
        //     onClick={handleClick}
        //     className={styles.pokemonCard}
        // >
        //     <div className={styles.pokemon}>
        //         <p className={styles.name}>
        //             {capitalizeFirstLetter(pokemon.name)}
        //         </p>
        // <img
        //     src={pokemon.sprites["front_default"]}
        //     alt={pokemon.name}
        // />
        //     </div>
        //     <div className={styles.typesContainer}>
        //         {pokemon.types && pokemon.types.length > 0 ? (
        //             pokemon.types.map((type, index) => (
        //                 <p
        //                     key={index}
        //                     className={styles.type}
        //                     style={{
        //                         backgroundColor: colors[type.type.name] || "",
        //                     }}
        //                 >
        //                     {capitalizeFirstLetter(type.type.name)}
        //                 </p>
        //             ))
        //         ) : (
        //             <p className={styles.type}>No types available</p>
        //         )}
        //     </div>
        // </li>

        <li className={styles.pokemonCard} onClick={handleClick}>
            <div className={styles.textContainer}>
                <p>
                    #{String(pokemon.id).padStart(3, "0")}
                </p>
                <p className={styles.name}>
                    {capitalizeFirstLetter(pokemon.name)}
                </p>
                <div className={styles.typesContainer}>
                    {pokemon.types && pokemon.types.length > 0 ? (
                        pokemon.types.map((type, index) => (
                            <p
                                key={index}
                                className={styles.type}
                                style={{
                                    backgroundColor: colors[type.type.name] || "",
                                }}
                            >
                                {capitalizeFirstLetter(type.type.name)}
                            </p>
                        ))
                    ) : (
                        <p className={styles.type}>No types available</p>
                    )}
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
