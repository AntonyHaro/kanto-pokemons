import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { gemini } from "../../api/api";
import { capitalizeFirstLetter } from "../../utils/utils";
import StatsContainer from "../../components/StatsContainer/StatsContainer";
import StatsComparator from "../../components/StatsComparator/StatsComparator";
import Header from "../../components/Header/Header";
import colors from "../../constants/colors";
import styles from "./Comparator.module.css";

const Pokemon = ({ pokemon }) => {
    const playSound = async (id) => {
        const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
        try {
            const audio = new Audio(soundUrl);
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    const firstType =
        pokemon.types && pokemon.types[0] ? pokemon.types[0].type.name : null;

    return (
        <li
            className={styles.pokemonCard}
            onClick={() => playSound(pokemon.id)}
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
};

function Compare() {
    const { id1, id2 } = useParams();
    const [pokemon1, setPokemon1] = useState(null);
    const [pokemon2, setPokemon2] = useState(null);
    const [comparisonResult, setComparisonResult] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchComparison = async () => {
        if (pokemon1 && pokemon2) {
            try {
                const result = await gemini(pokemon1, pokemon2);
                setComparisonResult(result);
            } catch (error) {
                console.error("Error generating comparison:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchPokemon = async (id, setPokemon) => {
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${id}`
                );
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
            }
        };

        fetchPokemon(id1, setPokemon1);
        fetchPokemon(id2, setPokemon2);
    }, [id1, id2]);

    useEffect(() => {
        fetchComparison();
    }, [pokemon1, pokemon2]);

    // if (loading) {
    //     return;
    // }

    return (
        <div className={styles.comparator}>
            <Header />
            <h1>Pokémon Comparator</h1>
            {loading ? (
                <p>Loading Pokémon data and comparison...</p>
            ) : (
                <>
                    <h2>
                        {capitalizeFirstLetter(pokemon1.name)} vs{" "}
                        {capitalizeFirstLetter(pokemon2.name)}
                    </h2>
                    <section className={styles.pokemonsCardsContainer}>
                        <div className={styles.pokemonContainer}>
                            <Pokemon pokemon={pokemon1} />
                            <StatsContainer pokemon={pokemon1} />
                        </div>
                        <hr />
                        <div className={styles.pokemonContainer}>
                            <Pokemon pokemon={pokemon2} />
                            <StatsContainer pokemon={pokemon2} />
                        </div>
                    </section>
                    <StatsComparator pokemon1={pokemon1} pokemon2={pokemon2} />
                    <section className={styles.result}>
                        <h2>Comparison Result:</h2>
                        <p>{comparisonResult}</p>
                    </section>
                </>
            )}
        </div>
    );
}

export default Compare;
