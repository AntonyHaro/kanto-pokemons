import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
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
                setMoveData({
                    name: data.name,
                    type: data.type.name || "Unknown",
                    power: data.power || "N/A",
                    accuracy: data.accuracy || "N/A",
                    pp: data.pp,
                    priority: data.priority,
                    effectChance: data.effect_chance || "N/A",
                    damageClass: data.damage_class.name || "N/A",
                    target: data.target.name || "N/A",
                    effect:
                        data.effect_entries[0]?.effect ||
                        "No effect description available",
                    shortEffect:
                        data.effect_entries[0]?.short_effect ||
                        "No short effect description available",
                });
            } catch (error) {
                setError(
                    "Failed to fetch move details. Please try again later."
                );
                console.error("Error fetching move details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoveData();
    }, [move]);

    if (loading) return <p>Loading move details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.moveDetail}>
            <header>
                <Link to={`/pokemon/${id}`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Pokémon
                </Link>
                <h1>{moveData.name}</h1>
            </header>

            <section className={styles.moveInfo}>
                <p>
                    <strong>Type:</strong> {moveData.type}
                </p>
                <p>
                    <strong>Power:</strong> {moveData.power}
                </p>
                <p>
                    <strong>Accuracy:</strong> {moveData.accuracy}
                </p>
                <p>
                    <strong>PP:</strong> {moveData.pp}
                </p>
                <p>
                    <strong>Priority:</strong> {moveData.priority}
                </p>
                <p>
                    <strong>Effect Chance:</strong> {moveData.effectChance}
                </p>
                <p>
                    <strong>Damage Class:</strong> {moveData.damageClass}
                </p>
                <p>
                    <strong>Target:</strong> {moveData.target}
                </p>
                <p>
                    <strong>Effect:</strong> {moveData.effect}
                </p>
                <p>
                    <strong>Short Effect:</strong> {moveData.shortEffect}
                </p>
            </section>
        </div>
    );
}

export default PokemonMove;
