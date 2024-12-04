import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { gemini } from "../../api/api";
import { capitalizeFirstLetter } from "../../utils/utils";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
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
    const [errorComparasion, setErrorComparasion] = useState(false);

    const fetchGemini = async (pokemon1, pokemon2) => {
        const pokemons = [pokemon1, pokemon2];

        try {
            const tasks = [
                {
                    content: `Pros using ${capitalizeFirstLetter(
                        pokemons[0].name
                    )} instead of ${capitalizeFirstLetter(pokemons[1].name)}`,
                },
                {
                    content: `Cons using ${capitalizeFirstLetter(
                        pokemons[0].name
                    )} instead of ${capitalizeFirstLetter(pokemons[1].name)}`,
                },
                {
                    content: `Pros using ${capitalizeFirstLetter(
                        pokemons[1].name
                    )} instead of ${capitalizeFirstLetter(pokemons[0].name)}`,
                },
                {
                    content: `Cons using ${capitalizeFirstLetter(
                        pokemons[1].name
                    )} instead of ${capitalizeFirstLetter(pokemons[0].name)}`,
                },
            ];

            const responses = await Promise.all(
                tasks.map((task) => gemini(task.content, pokemons))
            );

            return {
                pokemon1: {
                    pros: responses[0],
                    cons: responses[1],
                },
                pokemon2: {
                    pros: responses[2],
                    cons: responses[3],
                },
            };
        } catch (error) {
            console.error("Erro ao buscar dados do Gemini:", error);
            throw error;
        }
    };

    const fetchComparison = async () => {
        if (pokemon1 && pokemon2) {
            try {
                const result = await fetchGemini(pokemon1, pokemon2);
                setComparisonResult(result);
                console.log(comparisonResult);
            } catch (error) {
                setErrorComparasion(true);
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
        if (pokemon1 && pokemon2) fetchComparison();
    }, [pokemon1, pokemon2]);

    return (
        <div className={styles.comparator}>
            <Header />
            {/* <h1>Pokémon Comparator</h1> */}
            {loading ? (
                <p id="loader">Loading Pokémon data and comparison...</p>
            ) : (
                <>
                    <h2 className={styles.title}>
                        {capitalizeFirstLetter(pokemon1.name)} vs{" "}
                        {capitalizeFirstLetter(pokemon2.name)}
                    </h2>
                    <section className={styles.pokemonsCardsContainer}>
                        <div className={styles.pokemonContainer}>
                            <Pokemon pokemon={pokemon1} />
                            <StatsContainer pokemon={pokemon1} />
                        </div>
                        <div className={styles.pokemonContainer}>
                            <Pokemon pokemon={pokemon2} />
                            <StatsContainer pokemon={pokemon2} />
                        </div>
                    </section>
                    <StatsComparator pokemon1={pokemon1} pokemon2={pokemon2} />
                    <section className={styles.comparasion}>
                        <h2>Comparison Powered By Google Gemini AI:</h2>
                        {errorComparasion ? (
                            <p style={{ color: "red" }}>
                                Error fetching gemini... Try again later.
                            </p>
                        ) : (
                            <div className={styles.resultsContainer}>
                                <div className={styles.pros}>
                                    <h3>
                                        <FaChevronCircleUp />
                                        {capitalizeFirstLetter(
                                            pokemon1.name
                                        )}{" "}
                                        Pros:
                                    </h3>
                                    {comparisonResult.pokemon1.pros}
                                </div>
                                <div className={styles.cons}>
                                    <h3>
                                        <FaChevronCircleDown />
                                        {capitalizeFirstLetter(
                                            pokemon1.name
                                        )}{" "}
                                        Cons:
                                    </h3>
                                    {comparisonResult.pokemon1.cons}
                                </div>
                                <div className={styles.pros}>
                                    <h3>
                                        <FaChevronCircleUp />
                                        {capitalizeFirstLetter(
                                            pokemon2.name
                                        )}{" "}
                                        Pros:
                                    </h3>
                                    {comparisonResult.pokemon2.pros}
                                </div>
                                <div className={styles.cons}>
                                    <h3>
                                        <FaChevronCircleDown />
                                        {capitalizeFirstLetter(
                                            pokemon2.name
                                        )}{" "}
                                        Cons:
                                    </h3>
                                    {comparisonResult.pokemon2.cons}
                                </div>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default Compare;
