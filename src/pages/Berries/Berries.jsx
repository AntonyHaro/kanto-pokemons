import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Berries.module.css"; // Adapte conforme necessário.
import { capitalizeFirstLetter } from "../../utils/utils";

function Berries() {
    const [berries, setBerries] = useState([]); // Estado inicial como array vazio.
    const [loading, setLoading] = useState(true); // Indica estado de carregamento.
    const [error, setError] = useState(null); // Estado para erros.

    useEffect(() => {
        const fetchBerries = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch da lista principal de berries
                const berriesResponse = await fetch(
                    "https://pokeapi.co/api/v2/berry?limit=100"
                );
                if (!berriesResponse.ok) {
                    throw new Error("Failed to fetch berries list.");
                }

                const berriesData = await berriesResponse.json();
                const berriesResults = berriesData.results;

                // Fetch dos detalhes de cada berry
                const allBerriesDetails = await Promise.all(
                    berriesResults.map(async (berry) => {
                        const berryResponse = await fetch(berry.url);
                        if (!berryResponse.ok) {
                            throw new Error(
                                `Failed to fetch details for berry: ${berry.name}`
                            );
                        }
                        const berryData = await berryResponse.json();
                        return {
                            name: capitalizeFirstLetter(berry.name),
                            growthTime: berryData.growth_time,
                            size: berryData.size,
                            maxHarvest: berryData.max_harvest,
                            smoothness: berryData.smoothness,
                            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png`, // Adiciona a URL da imagem
                        };
                    })
                );

                setBerries(allBerriesDetails);
            } catch (error) {
                console.error("Error fetching berries:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBerries();
    }, []);

    console.log(berries);

    return (
        <div className={styles.berries}>
            <Header />
            <h1>All Berries</h1>
            <section className={styles.berriesSection} id="berries">
                {loading ? (
                    <p id="loader">Loading berries...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <ul className={styles.berriesContainer}>
                        {berries.map((berry, index) => (
                            <li key={index} className={styles.berry}>
                                <img
                                    src={berry.imageUrl}
                                    alt={`${berry.name} berry`}
                                    className={styles.berryImage}
                                />
                                <h2>{berry.name}</h2>
                                <p>Growth Time: {berry.growthTime}h</p>
                                <p>Size: {berry.size}mm</p>
                                <p>Max Harvest: {berry.maxHarvest}</p>
                                <p>Smoothness: {berry.smoothness}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default Berries;
