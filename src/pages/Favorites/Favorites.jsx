import { useState, useEffect } from "react";
import Filters from "../../components/Filters/Filters";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import PokemonList from "../../components/PokemonsList/PokemonsList";
import styles from "./Favorites.module.css";

function Favorites() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const favoritePokemons =
            JSON.parse(localStorage.getItem("favoritePokemons")) || [];
        setPokemons(favoritePokemons);
        setLoading(false);
    }, []);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/type");
                const data = await response.json();
                setTypes(data.results);
            } catch (error) {
                setError("Error fetching types");
                console.error("Error fetching types:", error);
            }
        };

        fetchTypes();
    }, []);

    const handleTypeSelection = (type) => {
        setSelectedTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };

    const filteredPokemons = pokemons.filter((pokemon) => {
        const matchesTypes = selectedTypes.length
            ? selectedTypes.some((type) =>
                  pokemon.types.some(
                      (pokemonType) => pokemonType.type.name === type
                  )
              )
            : true;

        const matchesSearch = pokemon.name
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase());

        return matchesTypes && matchesSearch;
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.favorites}>
            <header className={styles.header}>
                <Link to={`/`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Home
                </Link>
                <div className={styles.flexContainer}>
                    <h1>
                        Favorite Pokémons <FaStar />
                    </h1>
                    <div className={styles.search}></div>
                </div>
                <input
                    type="text"
                    placeholder="Search Pokémon:"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </header>
            <Filters
                selectedTypes={selectedTypes}
                handleTypeSelection={handleTypeSelection}
                types={types}
            />
            <PokemonList pokemons={filteredPokemons} />
        </div>
    );
}

export default Favorites;
