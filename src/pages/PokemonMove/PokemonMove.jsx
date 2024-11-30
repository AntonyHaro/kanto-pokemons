import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { capitalizeFirstLetter } from "../../utils/utils";
import PokemonList from "../../components/PokemonsList/PokemonsList";
import titleColors from "../../constants/titleColors";
import colors from "../../constants/colors";
import styles from "./PokemonMove.module.css";

function PokemonMove() {
    const { id, move } = useParams();
    const [moveData, setMoveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMoveData = async () => {
            const url = `https://pokeapi.co/api/v2/move/${move}`;
            try {
                const response = await fetch(url);
                if (!response.ok)
                    throw new Error("Failed to fetch move details");

                const data = await response.json();
                console.log(data);
                setMoveData({
                    name: capitalizeFirstLetter(data.name),
                    type: data.type.name || "Unknown",
                    power: data.power || "N/A",
                    accuracy: data.accuracy || "N/A",
                    pp: data.pp,
                    priority: data.priority,
                    effectChance: data.effect_chance || "N/A",
                    damageClass:
                        capitalizeFirstLetter(data.damage_class.name) || "N/A",
                    target: capitalizeFirstLetter(data.target.name) || "N/A",
                    effect:
                        data.effect_entries[0]?.effect ||
                        "No effect description available",
                    shortEffect:
                        data.effect_entries[0]?.short_effect ||
                        "No short effect description available",
                    statChanges: data.stat_changes.map(
                        (change) =>
                            `${capitalizeFirstLetter(change.stat.name)}: ${
                                change.change > 0 ? "+" : ""
                            }${change.change}`
                    ) || ["N/A"],
                    contestType: data.contest_type?.name
                        ? capitalizeFirstLetter(data.contest_type.name)
                        : "N/A",
                    contestEffect: data.contest_effect?.url
                        ? `See more: ${data.contest_effect.url}`
                        : "N/A",
                    learnedByPokemon: data.learned_by_pokemon,
                });
            } catch (error) {
                setError(
                    "Failed to fetch move details. Please try again later."
                );
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoveData();
    }, [move]);

    if (loading) return <p id="loader">Loading move details...</p>;

    if (error)
        return (
            <div style={{ display: "grid", gap: "1rem" }}>
                <Link to={`/pokemon/${id}`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Pokémon
                </Link>
                <p id="error-message">{error}</p>
            </div>
        );

    const hoverColor = {
        "--hover-color": titleColors[moveData.type],
    };

    return (
        <div className={styles.pokemonMove}>
            <header>
                {id != "null" ? (
                    <Link to={`/pokemon/${id}`} className={styles.backButton}>
                        <IoIosArrowBack /> Back to Pokémon
                    </Link>
                ) : (
                    <Link to={`/moves`} className={styles.backButton}>
                        <IoIosArrowBack /> Back to Moves
                    </Link>
                )}

                <h1 style={{ color: titleColors[moveData.type] }}>
                    {moveData.name}
                </h1>
            </header>

            <section className={styles.moveInfo}>
                <div className={styles.multipleSection}>
                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Type:</strong>
                        <p>{capitalizeFirstLetter(moveData.type)}</p>
                    </div>

                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>PP:</strong> <p>{moveData.pp}</p>
                    </div>
                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Accuracy:</strong> <p>{moveData.accuracy}</p>
                    </div>
                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Damage Class:</strong>{" "}
                        <p>{moveData.damageClass}</p>
                    </div>
                </div>

                <div
                    className={styles.multipleSection}
                    style={{ marginBottom: "1%" }}
                >
                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Power:</strong> <p>{moveData.power}</p>
                    </div>

                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Priority:</strong> <p>{moveData.priority}</p>
                    </div>

                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Effect Chance:</strong>
                        <p>{moveData.effectChance}</p>
                    </div>

                    <div className={styles.moveInfoItem} style={hoverColor}>
                        <strong>Target:</strong> <p>{moveData.target}</p>
                    </div>
                </div>
                <div className={styles.effect} style={hoverColor}>
                    <strong>Effect:</strong> <p>{moveData.effect}</p>
                </div>
                <div className={styles.effect} style={hoverColor}>
                    <strong>Short Effect:</strong> <p>{moveData.shortEffect}</p>
                </div>
                {/* oq esta errado aq */}
                <div className={styles.effect} style={hoverColor}>
                    <strong>Stat Changes:</strong>
                    <p>{moveData.statChanges.join(", ") || "None"}</p>
                </div>
            </section>

            <section className={styles.learnedByPokemon}>
                <h2>Learned By Pokémons:</h2>
                <LearnedByPokemon pokemons={moveData.learnedByPokemon} />
            </section>
        </div>
    );
}

export default PokemonMove;

function LearnedByPokemon({ pokemons }) {
    const [pokemonDetailsList, setPokemonDetailsList] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const pokemonDetails = await Promise.all(
                    pokemons.map(async (pokemon) => {
                        const response = await fetch(pokemon.url);
                        return response.json();
                    })
                );
                setPokemonDetailsList(pokemonDetails); // Properly update the state
            } catch (error) {
                console.error("Error fetching Pokémon details:", error);
            }
        };

        if (pokemons && pokemons.length > 0) {
            fetchPokemonDetails();
        }
    }, [pokemons]);

    if (!pokemonDetailsList) {
        return <p id="loader">Loading Pokémons...</p>;
    }

    return (
        <PokemonList
            pokemons={pokemonDetailsList}
            isComparatorOpen={null}
            onSelect={null}
            selectedPokemons={null}
        />
    );
}
