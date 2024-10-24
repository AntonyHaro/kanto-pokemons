import { useState, useEffect } from "react";
import PokemonsList from "../layout/PokemonsList";

import "./Home.css";

function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

        // Event listener for the theme toggle button
        const handleToggleClick = () => toggleTheme(themeToggleButton);
        themeToggleButton.addEventListener("click", handleToggleClick);

        // Cleanup event listener on unmount
        return () => {
            themeToggleButton.removeEventListener("click", handleToggleClick);
        };
    }, []);

    useEffect(() => {
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

        fetchPokemons();
    }, []);

    return (
        <div className="app-container">
            <header>
                <h1>
                    Kanto Pokémons <button id="theme-toggle"></button>
                </h1>
                <hr />
            </header>

            {loading ? (
                <p id="loader">Carregando Pokémons...</p>
            ) : error ? (
                <p id="error-message">{error}</p>
            ) : (
                <PokemonsList pokemons={pokemons} />
            )}
        </div>
    );
}

export default Home;
