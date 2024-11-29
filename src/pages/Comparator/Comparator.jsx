import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Comparator.module.css";

function Compare() {
    const { id1, id2 } = useParams();
    const [pokemon1, setPokemon1] = useState(null);
    const [pokemon2, setPokemon2] = useState(null);

    useEffect(() => {
        const fetchPokemon = async (id, setPokemon) => {
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${id}`
                );
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
            }
        };

        fetchPokemon(id1, setPokemon1);
        fetchPokemon(id2, setPokemon2);
    }, [id1, id2]);

    if (!pokemon1 || !pokemon2) {
        return <p>Loading Pokémon data...</p>;
    }

    return (
        <div>
            <h1>Compare Pokémon</h1>
            <div>
                <h2>{pokemon1.name}</h2>
                <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
            </div>
            <div>
                <h2>{pokemon2.name}</h2>
                <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
            </div>
        </div>
    );
}

export default Compare;
