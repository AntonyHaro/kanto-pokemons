import { useEffect, useState } from "react";
import Move from "../../components/Move/Move";
import Header from "../../components/Header/Header";
import styles from "./Moves.module.css"; // Adapte conforme necessário.

function Moves() {
    const [moves, setMoves] = useState(null);
    const [loading, setLoading] = useState(true); // Inicializa como carregando.
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMoves = async () => {
            setLoading(true);
            setError(null);

            try {
                const movesResponse = await fetch(
                    "https://pokeapi.co/api/v2/move?limit=1000"
                );
                if (!movesResponse.ok)
                    throw new Error("Failed to fetch moves list.");

                const movesData = await movesResponse.json();
                const movesResults = movesData.results;

                const allMoveDetails = await Promise.all(
                    movesResults.map(async (move) => {
                        const moveResponse = await fetch(move.url);
                        if (!moveResponse.ok)
                            throw new Error(
                                `Failed to fetch details for move: ${move.name}`
                            );
                        const moveData = await moveResponse.json();
                        return {
                            name: move.name,
                            power: moveData.power,
                            accuracy: moveData.accuracy,
                            type: moveData.type.name,
                            pp: moveData.pp,
                        };
                    })
                );

                setMoves(allMoveDetails);
            } catch (error) {
                console.error("Error fetching moves:", error);
                setError(error.message); // Exibe mensagem de erro.
            } finally {
                setLoading(false); // Atualiza estado para finalizar carregamento.
            }
        };

        fetchMoves();
    }, []);

    return (
        <>
            <div className={styles.moves}>
                <Header />
                <h1>All Moves</h1>
                <section className={styles.movesSection} id="moves">
                    <p>Click on a move to see more details.</p>
                    {loading ? (
                        <p id="loader">Loading moves...</p>
                    ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <ul className={styles.movesContainer}>
                            {moves.map((move, index) => (
                                <Move key={index} move={move} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}

export default Moves;
