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
            <header>
                <h1>{capitalizeFirstLetter(pokemon.name)}</h1>
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
            
            <section className={styles.generalInfo}>
                <div className={styles.info}>
                    <h2>General Information</h2>
                    <p>
                        <strong>ID:</strong> {pokemon.id}
                    </p>
                    <p>
                        <strong>Height:</strong> {pokemon.height / 10} m
                    </p>
                    <p>
                        <strong>Weight:</strong> {pokemon.weight / 10} kg
                    </p>
                    <p>
                        <strong>Base Experience:</strong>{" "}
                        {pokemon.base_experience}
                    </p>
                </div>
            </section>

            <section>
                <h2>Abilities</h2>
                <ul>
                    {pokemon.abilities.map((ability) => (
                        <li key={ability.ability.name}>
                            {capitalizeFirstLetter(ability.ability.name)}{" "}
                            {ability.is_hidden ? "(Hidden)" : ""}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Stats</h2>
                {pokemon.stats.map((stat) => (
                    <p key={stat.stat.name}>
                        <strong>
                            {capitalizeFirstLetter(stat.stat.name)}:
                        </strong>{" "}
                        {stat.base_stat}
                    </p>
                ))}
            </section>

            <section>
                <h2>Moves</h2>
                <ul>
                    {pokemon.moves.slice(0, 10).map(
                        (
                            move // Display the first 10 moves
                        ) => (
                            <li key={move.move.name}>
                                {capitalizeFirstLetter(move.move.name)}
                            </li>
                        )
                    )}
                </ul>
            </section>

            <section>
                <h2>Forms</h2>
                {pokemon.forms.length > 1 ? (
                    <ul>
                        {pokemon.forms.map((form) => (
                            <li key={form.name}>
                                {capitalizeFirstLetter(form.name)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{capitalizeFirstLetter(pokemon.forms[0].name)}</p>
                )}
            </section>
        </div>
    );
}

export default PokemonInfo;
