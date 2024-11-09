import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import colors from "../../constants/colors";
import styles from "./PokemonInfo.module.css";

function PokemonInfo() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch Pokémon");

                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                setError("Failed to fetch Pokémon. Please try again later.");
                console.error("Error fetching Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [id]);

    if (loading) {
        return <p id="loader">Loading Pokémon...</p>;
    }

    if (error) {
        return <p id="error-message">{error}</p>;
    }

    if (!pokemon) {
        return <p id="error-message">No Pokémon found</p>;
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className={styles.pokemon_info}>
            <Link to="/" className={styles.backButton}>
                {">"} Back to Home
            </Link>
            <header>
                <h1 style={{ color: colors[pokemon.types[0].type.name] }}>
                    {capitalizeFirstLetter(pokemon.name)}, #{pokemon.id}
                </h1>
                <div className={styles.typesContainer}>
                    {pokemon.types.map((type, index) => (
                        <p
                            key={index}
                            className={styles.type}
                            style={{ backgroundColor: colors[type.type.name] }}
                        >
                            {capitalizeFirstLetter(type.type.name)}
                        </p>
                    ))}
                </div>
            </header>

            <div className={styles.sprites}>
                <img src={pokemon.sprites.front_default} alt="Front Default" />
                <img src={pokemon.sprites.back_default} alt="Back Default" />
                {pokemon.sprites.front_shiny && (
                    <>
                        <img
                            src={pokemon.sprites.front_shiny}
                            alt="Front Shiny"
                        />
                        <img
                            src={pokemon.sprites.back_shiny}
                            alt="Back Shiny"
                        />
                    </>
                )}
            </div>

            <section className={styles.dualSection}>
                <section className={styles.generalInfo}>
                    <h2>General Information</h2>
                    <div className={styles.infoContainer}>
                        <p className={styles.info}>
                            <strong>ID:</strong> {pokemon.id}
                        </p>
                        <p className={styles.info}>
                            <strong>Height:</strong> {pokemon.height / 10} m
                        </p>
                        <p className={styles.info}>
                            <strong>Weight:</strong> {pokemon.weight / 10} kg
                        </p>
                        <p className={styles.info}>
                            <strong>Base Experience:</strong>{" "}
                            {pokemon.base_experience}
                        </p>
                    </div>
                </section>

                <section className={styles.statsContainer}>
                    <h2>Stats</h2>
                    <div className={styles.flexContainer}>
                        {pokemon.stats.map((stat) => (
                            <div
                                key={stat.stat.name}
                                className={styles.stats}
                                style={{
                                    backgroundColor:
                                        colors[pokemon.types[0].type.name],
                                }}
                            >
                                <p className={styles.statName}>
                                    {capitalizeFirstLetter(stat.stat.name)}:
                                </p>
                                <p className={styles.statInfo}>
                                    {stat.base_stat}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </section>

            <section>
                <h2>Abilities</h2>
                <ul className={styles.abilitiesContainer}>
                    {pokemon.abilities.map((ability) => (
                        <li key={ability.ability.name}>
                            {console.log(ability.ability)}
                            {capitalizeFirstLetter(ability.ability.name)}{" "}
                            {ability.is_hidden ? "(Hidden)" : ""}
                        </li>
                    ))}
                </ul>
            </section>

            <section className={styles.movesSection}>
                <h2>Moves</h2>
                <ul className={styles.movesContainer}>
                    {pokemon.moves.map((move) => (
                        <li key={move.move.name}>
                            {console.log(move.move.url)}
                            {capitalizeFirstLetter(move.move.name)}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default PokemonInfo;
