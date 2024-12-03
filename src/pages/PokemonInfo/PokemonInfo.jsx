import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaStar, FaUsers } from "react-icons/fa6";
import { FaRulerVertical, FaWeight, FaArrowRight } from "react-icons/fa";

import titleColors from "../../constants/titleColors";
import colors from "../../constants/colors";
import { capitalizeFirstLetter } from "../../utils/utils";

import StatsContainer from "../../components/StatsContainer/StatsContainer";
import TeamsContainer from "../../components/TeamsContainer/TeamsContainer";
import Move from "../../components/Move/Move";
import Modal from "../../components/Modal/Modal";
import styles from "./PokemonInfo.module.css";

function PokemonInfo() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pokemonMoves, setPokemonMoves] = useState(null);
    const [loadingMoves, setLoadingMoves] = useState(true);
    const [errorMoves, setErrorMoves] = useState(null);

    const [pokemonAbilities, setPokemonAbilities] = useState(null);
    const [errorAbilities, setErrorAbilities] = useState(null);
    const [loadingAbilities, setLoadingAbilities] = useState(true);

    const [favorite, setFavorite] = useState(false);
    const [team, setTeam] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loadingEvolution, setLoadingEvolution] = useState(true);
    const [errorEvolution, setErrorEvolution] = useState(null);

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

        // Verifica se o Pokémon está marcado como favorito ao carregar a página
        const checkFavoriteStatus = () => {
            const favoritePokemons =
                JSON.parse(localStorage.getItem("favoritePokemons")) || [];

            const isFavorite = favoritePokemons.some(
                (fav) => fav.id === Number(id)
            );

            setFavorite(isFavorite);
        };

        fetchPokemon();
        checkFavoriteStatus();
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

            const fetchAbilities = async () => {
                try {
                    const abilityDetails = await Promise.all(
                        pokemon.abilities.map(async (ability) => {
                            const abilityResponse = await fetch(
                                ability.ability.url
                            );
                            if (!abilityResponse.ok) {
                                throw new Error(
                                    `Failed to fetch ability details for ${ability.ability.name}`
                                );
                            }
                            const abilityData = await abilityResponse.json();
                            return abilityData || null;
                        })
                    );

                    setPokemonAbilities(abilityDetails);
                } catch (error) {
                    setErrorAbilities(
                        "Failed to fetch ability details. Please try again later."
                    );
                    console.error("Error fetching ability details:", error);
                } finally {
                    setLoadingAbilities(false);
                }
            };

            fetchAbilities();
            fetchMoves();
        }
    }, [pokemon]);

    useEffect(() => {
        const fetchEvolutionChain = async () => {
            try {
                // Buscar dados de espécie
                const speciesResponse = await fetch(
                    `https://pokeapi.co/api/v2/pokemon-species/${id}`
                );
                if (!speciesResponse.ok)
                    throw new Error("Failed to fetch Pokémon species");
                const speciesData = await speciesResponse.json();

                // Buscar dados da cadeia de evolução
                const evolutionResponse = await fetch(
                    speciesData.evolution_chain.url
                );
                if (!evolutionResponse.ok)
                    throw new Error("Failed to fetch evolution chain");
                const evolutionData = await evolutionResponse.json();

                // Processar dados para uma estrutura mais amigável
                const chain = [];
                let current = evolutionData.chain;
                while (current) {
                    chain.push({
                        name: current.species.name,
                        url: current.species.url,
                    });
                    current = current.evolves_to[0] || null;
                }

                setEvolutionChain(chain);
            } catch (error) {
                setErrorEvolution(
                    "Failed to fetch evolution chain. Please try again later."
                );
                console.error("Error fetching evolution chain:", error);
            } finally {
                setLoadingEvolution(false);
            }
        };

        fetchEvolutionChain();
    }, [id]);

    const handleFavorite = (pokemon) => {
        if (!pokemon || typeof pokemon !== "object") {
            console.error("O argumento precisa ser um objeto válido.");
            return;
        }

        const favoritePokemons =
            JSON.parse(localStorage.getItem("favoritePokemons")) || [];

        // Verifica se o Pokémon já está nos favoritos
        const isAlreadyFavorite = favoritePokemons.some(
            (fav) => fav.id === pokemon.id
        );

        if (isAlreadyFavorite) {
            // Remove o Pokémon dos favoritos
            const updatedFavoritePokemons = favoritePokemons.filter(
                (fav) => fav.id !== pokemon.id
            );

            localStorage.setItem(
                "favoritePokemons",
                JSON.stringify(updatedFavoritePokemons)
            );

            setFavorite(false);
        } else {
            // Adiciona o Pokémon aos favoritos
            const updatedFavoritePokemons = [...favoritePokemons, pokemon];

            localStorage.setItem(
                "favoritePokemons",
                JSON.stringify(updatedFavoritePokemons)
            );

            setFavorite(true);
        }
    };

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
                    <h1
                        style={{
                            color: titleColors[pokemon.types[0].type.name],
                        }}
                    >
                        {capitalizeFirstLetter(pokemon.name)}, #
                        {String(pokemon.id).padStart(3, "0")}
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

                    <div className={styles.btnsContainer}>
                        <button
                            onClick={() => handleFavorite(pokemon)}
                            className={`${styles.button} ${
                                favorite ? styles.favorite : ""
                            }`}
                        >
                            <FaStar />
                        </button>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="#stats">Stats</a>
                        </li>
                        <li>
                            <a href="#abilities">Abilities</a>
                        </li>
                        <li>
                            <a href="#evolution">Evolution</a>
                        </li>
                        <li>
                            <a href="#moves">Moves</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <section className={styles.generalInfo}>
                <div className={styles.infoContainer}>
                    <div className={styles.info}>
                        <FaRulerVertical
                            style={{
                                color: titleColors[pokemon.types[0].type.name],
                            }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Height:</strong>
                            {pokemon.height / 10} m
                        </div>
                    </div>
                    <div className={styles.info}>
                        <FaWeight
                            style={{
                                color: titleColors[pokemon.types[0].type.name],
                            }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Weight:</strong>
                            {pokemon.weight / 10} kg
                        </div>
                    </div>
                    <div className={styles.info}>
                        <FaStar
                            style={{
                                color: titleColors[pokemon.types[0].type.name],
                            }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Base Experience:</strong>
                            {pokemon.base_experience}
                        </div>
                    </div>
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

            <StatsContainer pokemon={pokemon} />

            <section id="abilities">
                <h2>Abilities</h2>
                {loadingAbilities ? (
                    <p>Loading abilities...</p>
                ) : errorAbilities ? (
                    <p>{errorAbilities}</p>
                ) : pokemonAbilities && pokemonAbilities.length > 0 ? (
                    <ul className={styles.abilitiesContainer}>
                        {pokemonAbilities.map((ability, index) => (
                            <li key={index}>
                                <strong>
                                    {capitalizeFirstLetter(ability.name)}
                                    {pokemon.abilities[index].is_hidden ? (
                                        <span> (hidden)</span>
                                    ) : (
                                        ""
                                    )}
                                </strong>
                                <p>
                                    {ability.effect_entries.find(
                                        (entry) => entry.language.name === "en"
                                    )?.effect ||
                                        "Effect not available in English."}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p id="loader">No abilities found.</p>
                )}
            </section>

            <section id="evolution" className={styles.evolutionSection}>
                <h2>Evolution Chain</h2>
                {loadingEvolution ? (
                    <p id="loader">Loading evolution chain...</p>
                ) : errorEvolution ? (
                    <p>{errorEvolution}</p>
                ) : evolutionChain && evolutionChain.length > 0 ? (
                    <ul className={styles.evolutionContainer}>
                        {evolutionChain.map((evolution, index) => {
                            const nextEvolution =
                                evolutionChain[index + 1] || null;

                            return (
                                <>
                                    <li
                                        key={index}
                                        className={styles.evolutionItem}
                                    >
                                        <div
                                            className={styles.imgContainer}
                                            style={{
                                                backgroundColor: titleColors[pokemon.types[0].type.name],
                                            }}
                                        >
                                            <img
                                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.url
                                                    .split("/")
                                                    .filter(Boolean)
                                                    .pop()}.png`}
                                                alt={evolution.name}
                                                className={
                                                    styles.evolutionSprite
                                                }
                                            />
                                        </div>
                                        <strong>
                                            {capitalizeFirstLetter(
                                                evolution.name
                                            )}
                                        </strong>
                                    </li>

                                    {/* Verifica se existe uma próxima evolução */}
                                    {nextEvolution && (
                                        <div 
                                            className={styles.evolutionArrow}
                                            style={{
                                                color: titleColors[pokemon.types[0].type.name],
                                            }}
                                        >
                                            <span>
                                                Level {nextEvolution.level} 
                                            </span>
                                            <FaArrowRight />
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No evolution chain found.</p>
                )}
            </section>

            <section className={styles.movesSection} id="moves">
                <h2>Moves</h2>
                <p>Click in one move to see more details.</p>
                <ul className={styles.movesContainer}>
                    {loadingMoves ? (
                        <p id="loader">Loading moves...</p>
                    ) : errorMoves ? (
                        <p>{errorMoves}</p>
                    ) : (
                        pokemonMoves &&
                        pokemonMoves.map((move, index) => (
                            <Move
                                key={index}
                                move={{
                                    ...move,
                                    pokemonId: pokemon.id,
                                }}
                            />
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}

export default PokemonInfo;
