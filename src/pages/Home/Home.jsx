import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Filters from "../../components/Filters/Filters";
import PokemonsList from "../../components/PokemonsList/PokemonsList";
import styles from "./Home.module.css";

function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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
                console.error("Error fetching types:", error);
            }
        };

        const fetchPokemons = async () => {
            const url = "https://pokeapi.co/api/v2/pokemon?limit=151";

            try {
                const response = await fetch(url);
                if (!response.ok)
                    throw new Error("Failed to fetch Pokémon list");

                const data = await response.json();
                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const pokemonResponse = await fetch(pokemon.url);
                        return pokemonResponse.json();
                    })
                );

                setPokemons(pokemonDetails);
            } catch (error) {
                setError("Failed to fetch Pokémon. Please try again later.");
                console.error("Error fetching Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
        fetchPokemons();
    }, []);

    const filteredPokemons = pokemons.filter((pokemon) => {
        const matchesType = selectedType
            ? pokemon.types.some((type) => type.type.name === selectedType)
            : true;
        const matchesSearch = pokemon.name
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase());

        return matchesType && matchesSearch;
    });

    return (
        <div className={styles.app_container}>
            <Header 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />
            <Filters
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                types={types}
                pokemons={pokemons}
            />
            {loading ? (
                <p id="loader">Loading Pokémons...</p>
            ) : error ? (
                <p id="error-message">{error}</p>
            ) : (
                <PokemonsList pokemons={filteredPokemons} />
            )}
        </div>
    );
}

export default Home;
