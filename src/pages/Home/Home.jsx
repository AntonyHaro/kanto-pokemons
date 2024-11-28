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
    const [isFilterOpen, setIsFilterOpen] = useState(true);

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

    // Função que alterna a seleção de um tipo de Pokémon
    const handleTypeSelection = (type) => {
        setSelectedTypes(
            (prevTypes) =>
                // Verifica se o tipo já está na lista de tipos selecionados
                prevTypes.includes(type)
                    ? prevTypes.filter((t) => t !== type) // Se já estiver na lista, remove o tipo filtrando o array para não incluí-lo
                    : [...prevTypes, type] // Se não estiver na lista, adiciona o tipo ao final do array
        );
    };

    // Filtra a lista de Pokémon com base nos tipos selecionados e no termo de busca
    const filteredPokemons = pokemons.filter((pokemon) => {
        const matchesTypes = selectedTypes.length // Checa se há tipos selecionados
            ? // fitra o pokemon caso tenha pelo menos UM dos tiops já selecionados
              selectedTypes.some((type) =>
                  pokemon.types.some(
                      (pokemonType) => pokemonType.type.name === type
                  )
              )
            : true; // Se nenhum tipo foi selecionado, aceita todos os Pokémon

        const matchesSearch = pokemon.name
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase());

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
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
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
