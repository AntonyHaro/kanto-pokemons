import { useState, useEffect } from "react";
import PokemonsList from "../../components/PokemonsList/PokemonsList";
import styles from "./Home.module.css";
import Filters from "../../components/Filters/Filters";

function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");

    const toggleTheme = (themeToggleButton) => {
        const isDarkMode = document.body.classList.toggle("dark-mode");
        themeToggleButton.textContent = isDarkMode ? "🌞" : "🌙";
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        const isDarkMode = savedTheme === "dark";
        document.body.classList.toggle("dark-mode", isDarkMode);

        const themeToggleButton = document.getElementById("theme-toggle");
        themeToggleButton.textContent = isDarkMode ? "🌞" : "🌙";

        const handleToggleClick = () => toggleTheme(themeToggleButton);
        themeToggleButton.addEventListener("click", handleToggleClick);

        return () => {
            themeToggleButton.removeEventListener("click", handleToggleClick);
        };
    }, []);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/type");
                const data = await response.json();
                setTypes(data.results);
            } catch (error) {
                console.error("Erro ao buscar tipos:", error);
            }
        };

        const fetchPokemons = async () => {
            const url = "https://pokeapi.co/api/v2/pokemon?limit=151";

            try {
                const response = await fetch(url);
                if (!response.ok)
                    throw new Error("Erro ao buscar a lista de Pokémons");

                const data = await response.json();
                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const pokemonResponse = await fetch(pokemon.url);
                        return pokemonResponse.json();
                    })
                );

                setPokemons(pokemonDetails);
            } catch (error) {
                setError(
                    "Erro ao buscar Pokémons. Tente novamente mais tarde."
                );
                console.error("Erro ao buscar Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
        fetchPokemons();
    }, []);

    const filteredPokemons = selectedType
        ? pokemons.filter((pokemon) =>
              pokemon.types.some((type) => type.type.name === selectedType)
          )
        : pokemons;

    return (
        <div className={styles.app_container}>
            <header>
                <h1>
                    Kanto Pokémons <button id="theme-toggle"></button>
                </h1>
                <hr />

                <Filters
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    types={types}
                    pokemons={pokemons}
                />
            </header>

            {loading ? (
                <p id="loader">Carregando Pokémons...</p>
            ) : error ? (
                <p id="error-message">{error}</p>
            ) : (
                <PokemonsList pokemons={filteredPokemons} />
            )}
        </div>
    );
}

export default Home;
