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
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(true)

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
                if (!response.ok) throw new Error("Failed to fetch Pokémon list");

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

    // Função que alterna a seleção de um tipo de Pokémon 
    const handleTypeSelection = (type) => {
        setSelectedTypes((prevTypes) =>
            // Verifica se o tipo já está na lista de tipos selecionados
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type) // Se já estiver na lista, remove o tipo filtrando o array para não incluí-lo
                : [...prevTypes, type] // Se não estiver na lista, adiciona o tipo ao final do array
        );
    };


    // Filtra a lista de Pokémon com base nos tipos selecionados e no termo de busca
    const filteredPokemons = pokemons.filter((pokemon) => {
        const matchesTypes = selectedTypes.length // Checa se há tipos selecionados
            ? selectedTypes.every((type) => // Se há tipos selecionados, verifica se todos estão presentes nos tipos do Pokémon
                pokemon.types.some((pokemonType) => pokemonType.type.name === type) // Verifica se a lista de tipos do Pokémon atual coincide com `type`
            )
            : true; // Se nenhum tipo foi selecionado, aceita todos os Pokémon

        const matchesSearch = pokemon.name
            .toLowerCase() // Transforma o nome em letras minúsculas para comparação
            .startsWith(searchTerm.toLowerCase()); // Compara o início do nome com o termo de busca, também em minúsculas

        return matchesTypes && matchesSearch;
    });


    return (
        <div className={styles.app_container}>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
            />
            <Filters
                selectedTypes={selectedTypes}
                handleTypeSelection={handleTypeSelection}
                types={types}
                pokemons={pokemons}
                isFilterOpen={isFilterOpen}
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
