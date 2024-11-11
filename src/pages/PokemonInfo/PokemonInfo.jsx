import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import colors from "../../constants/colors";
import styles from "./PokemonInfo.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { FaRulerVertical, FaWeight, FaStar } from 'react-icons/fa';

function PokemonInfo() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pokemonMoves, setPokemonMoves] = useState(null);
    const [loadingMoves, setLoadingMoves] = useState(true);
    const [errorMoves, setErrorMoves] = useState(null);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const calculateStatBar = (stat, maxStat) => {
        return (stat / maxStat) * 100;
    };

    const maxStats = [
        255, // HP
        190, // Attack
        250, // Defense
        194, // Special Attack
        250, // Special Defense
        200, // Speed
    ];

    useEffect(() => {
        // Função para buscar os detalhes do Pokémon
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

    useEffect(() => {
        if (pokemon) {
            const fetchMoves = async () => {
                try {
                    const moveDetails = await Promise.all(
                        pokemon.moves.map(async (move) => {
                            const moveResponse = await fetch(move.move.url);
                            if (!moveResponse.ok)
                                throw new Error(
                                    `Failed to fetch move details for ${move.move.name}`
                                );
                            const moveData = await moveResponse.json();
                            return {
                                name: move.move.name,
                                power: moveData.power,
                                accuracy: moveData.accuracy,
                                type: moveData.type.name,
                                pp: moveData.pp,
                            };
                        })
                    );

                    setPokemonMoves(moveDetails);
                } catch (error) {
                    setErrorMoves(
                        "Failed to fetch move details. Please try again later."
                    );
                    console.error("Error fetching move details:", error);
                } finally {
                    setLoadingMoves(false);
                }
            };

            fetchMoves();
        }
    }, [pokemon]); // O useEffect só será chamado quando o estado `pokemon` estiver disponível.

    if (loading) {
        return <p id="loader">Loading Pokémon...</p>;
    }

    if (error) {
        return <p id="error-message">{error}</p>;
    }

    if (!pokemon) {
        return <p id="error-message">No Pokémon found</p>;
    }

    return (
        <div className={styles.pokemon_info}>
            <header>
                <Link to="/" className={styles.backButton}>
                    <IoIosArrowBack /> Back to Home
                </Link>
                <div className={styles.pokemonHeader}>
                    <h1 style={{ color: colors[pokemon.types[0].type.name] }}>
                        {capitalizeFirstLetter(pokemon.name)}, #{String(pokemon.id).padStart(3, '0')}
                    </h1>
                    <div className={styles.typesContainer}>
                        {pokemon.types.map((type, index) => (
                            <p
                                key={index}
                                className={styles.type}
                                style={{
                                    backgroundColor: colors[type.type.name],
                                }}
                            >
                                {capitalizeFirstLetter(type.type.name)}
                            </p>
                        ))}
                    </div>
                </div>
            </header>

            <section className={styles.generalInfo}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, molestiae dolores consequuntur, dolorum consectetur tenetur maxime corrupti iusto quas sunt fugit autem ipsum nam hic alias. Qui molestias non consectetur.</p>
                <div className={styles.infoContainer}>
                    <p className={styles.info}>
                        <FaRulerVertical 
                            style={{ color: colors[pokemon.types[0].type.name] }} 
                        /> 
                        <div className={styles.infoRow}>
                            <strong>Height:</strong> 
                            {pokemon.height / 10} m
                        </div>
                    </p>
                    <p className={styles.info}>
                        <FaWeight
                            style={{ color: colors[pokemon.types[0].type.name] }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Weight:</strong>
                            {pokemon.weight / 10} kg
                        </div>
                    </p>
                    <p className={styles.info}>
                        <FaStar 
                            style={{ color: colors[pokemon.types[0].type.name] }} 
                        />
                        <div className={styles.infoRow}>
                            <strong>Base Experience:</strong> 
                            {pokemon.base_experience}
                        </div>
                    </p>
                </div>
            </section>


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

            <section className={styles.statsContainer}>
                <h2>Stats</h2>
                <div className={styles.flexContainer}>
                    {pokemon.stats.map((stat, index) => (
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
                            <p className={styles.statInfo}>{stat.base_stat}</p>
                            <div className={styles.statBarContainer}>
                                <div
                                    className={styles.statBar}
                                    style={{
                                        width: `${calculateStatBar(
                                            stat.base_stat,
                                            maxStats[index]
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2>Abilities</h2>
                <ul className={styles.abilitiesContainer}>
                    {pokemon.abilities.map((ability) => (
                        <li key={ability.ability.name}>
                            {capitalizeFirstLetter(ability.ability.name)}{" "}
                            {ability.is_hidden ? "(Hidden)" : ""}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Detalhes dos Movimentos */}
            <section className={styles.movesSection}>
                <h2>Moves</h2>
                <ul className={styles.movesContainer}>
                    {loadingMoves ? (
                        <p>Loading moves...</p>
                    ) : errorMoves ? (
                        <p>{errorMoves}</p>
                    ) : (
                        pokemonMoves &&
                        pokemonMoves.map((move, index) => (
                            <li key={index}>
                                <p>
                                    <strong
                                        style={{
                                            backgroundColor: colors[move.type],
                                        }}
                                    >
                                        {capitalizeFirstLetter(move.name)}
                                    </strong>
                                </p>

                                <p>Type: {capitalizeFirstLetter(move.type)}</p>
                                <p>Power: {move.power ? move.power : "N/A"}</p>
                                <p>
                                    Accuracy:{" "}
                                    {move.accuracy ? move.accuracy : "N/A"}
                                </p>
                                <p>PP: {move.pp}</p>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}

export default PokemonInfo;
