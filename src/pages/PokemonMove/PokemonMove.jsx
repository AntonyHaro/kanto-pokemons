import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { capitalizeFirstLetter } from "../../utils/utils";
import PokemonList from "../../components/PokemonsList/PokemonsList";
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
                const {
                    name,
                    type,
                    power,
                    accuracy,
                    pp,
                    priority,
                    effect_chance,
                    damage_class,
                    target,
                    effect_entries,
                    stat_changes,
                    contest_type,
                    contest_effect,
                    learned_by_pokemon,
                } = data;

                setMoveData({
                    name: capitalizeFirstLetter(name),
                    type: type.name || "Unknown",
                    power: power || "N/A",
                    accuracy: accuracy || "N/A",
                    pp,
                    priority,
                    effectChance: effect_chance || "N/A",
                    damageClass:
                        capitalizeFirstLetter(damage_class.name) || "N/A",
                    target: capitalizeFirstLetter(target.name) || "N/A",
                    effect:
                        effect_entries[0]?.effect ||
                        "No effect description available",
                    shortEffect:
                        effect_entries[0]?.short_effect ||
                        "No short effect description available",
                    statChanges: stat_changes.map(
                        (change) =>
                            `${capitalizeFirstLetter(change.stat.name)}: ${
                                change.change > 0 ? "+" : ""
                            }${change.change}`
                    ) || ["N/A"],
                    contestType: contest_type?.name
                        ? capitalizeFirstLetter(contest_type.name)
                        : "N/A",
                    contestEffect: contest_effect?.url
                        ? `See more: ${contest_effect.url}`
                        : "N/A",
                    learnedByPokemon: learned_by_pokemon,
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

    if (loading) return <p>Loading move details...</p>;

    if (error)
        return (
            <div style={{ display: "grid", gap: "1rem" }}>
                <Link to={`/pokemon/${id}`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Pokémon
                </Link>
                <p id="error-message">{error}</p>
            </div>
        );

    const borderColor = { borderColor: colors[moveData.type] };

    return (
        <div className={styles.pokemonMove}>
            <header>
                <Link to={`/pokemon/${id}`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Pokémon
                </Link>
                <h1 style={{ color: colors[moveData.type] }}>
                    {moveData.name}
                </h1>
            </header>

            <section className={styles.moveInfo}>
                {renderMoveInfo(
                    [
                        { label: "Type", value: moveData.type },
                        { label: "PP", value: moveData.pp },
                        { label: "Accuracy", value: moveData.accuracy },
                        { label: "Damage Class", value: moveData.damageClass },
                        { label: "Power", value: moveData.power },
                        { label: "Priority", value: moveData.priority },
                        {
                            label: "Effect Chance",
                            value: moveData.effectChance,
                        },
                        { label: "Target", value: moveData.target },
                        { label: "Effect", value: moveData.effect },
                        { label: "Short Effect", value: moveData.shortEffect },
                        {
                            label: "Stat Changes",
                            value: moveData.statChanges.join(", "),
                        },
                        { label: "Contest Type", value: moveData.contestType },
                    ],
                    moveData.type
                )}
            </section>

            <section>
                <h2>Learned By Pokémons:</h2>
                <LearnedByPokemon pokemons={moveData.learnedByPokemon} />
            </section>
        </div>
    );
}

export default PokemonMove;

function renderMoveInfo(infoArray, moveType) {
    const hoverStyle = { "--hover-bg-color": colors[moveType] };

    return infoArray.map(({ label, value }) => (
        <div className={styles.moveInfoItem} key={label} style={hoverStyle}>
            <strong>{label}:</strong> <p>{value}</p>
        </div>
    ));
}

function LearnedByPokemon({ pokemons }) {
    const [pokemonDetailsList, setPokemonDetailsList] = useState(null);

    const fetchPokemonDetails = useCallback(async () => {
        try {
            const pokemonDetails = await Promise.all(
                pokemons.map(async (pokemon) => {
                    const response = await fetch(pokemon.url);
                    return response.json();
                })
            );
            setPokemonDetailsList(pokemonDetails);
        } catch (error) {
            console.error("Error fetching Pokémon details:", error);
        }
    }, [pokemons]);

    useEffect(() => {
        if (pokemons && pokemons.length > 0) {
            fetchPokemonDetails();
        }
    }, [pokemons, fetchPokemonDetails]);

    if (!pokemonDetailsList) {
        return <p>Loading Pokémon details...</p>;
    }

    return <PokemonList pokemons={pokemonDetailsList} />;
}
