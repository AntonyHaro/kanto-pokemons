import styles from "./StatsComparator.module.css";
import { capitalizeFirstLetter } from "../../utils/utils";

function StatsComparator({ pokemon1, pokemon2 }) {
    if (!pokemon1 || !pokemon2) {
        return <p>Loading Pokémon data for comparison...</p>;
    }

    // Helper function to render stat bars
    const renderStatBar = (statName, stat1, stat2) => {
        const maxStat = Math.max(stat1, stat2); // Determine the maximum value for scaling
        const isStat1Higher = stat1 >= stat2; // Check if stat1 is greater or equal

        return (
            <div className={styles.statRow} key={statName}>
                <div className={styles.statName}>{statName}</div>
                <div className={styles.statBars}>
                    <div
                        className={styles.statBar}
                        style={{
                            width: `${(stat1 / maxStat) * 100}%`,
                            backgroundColor: isStat1Higher
                                ? "gray"
                                : "lightgray", // Apply color based on comparison
                        }}
                        title={`${pokemon1.name}: ${stat1}`}
                    ></div>
                    <div
                        className={styles.statBar}
                        style={{
                            width: `${(stat2 / maxStat) * 100}%`,
                            backgroundColor: isStat1Higher
                                ? "lightgray"
                                : "gray", // Apply color based on comparison
                        }}
                        title={`${pokemon2.name}: ${stat2}`}
                    ></div>
                </div>
                <div className={styles.statValues}>
                    <span>{stat1}</span> x <span>{stat2}</span>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.statsComparator}>
            <h2>
                {capitalizeFirstLetter(pokemon1.name)} vs{" "}
                {capitalizeFirstLetter(pokemon2.name)} Stats
            </h2>
            <hr />
            <div className={styles.statsContainer}>
                {pokemon1.stats.map((stat, index) => {
                    const statName = stat.stat.name
                        .replace("-", " ")
                        .toUpperCase();
                    const stat1 = stat.base_stat;
                    const stat2 = pokemon2.stats[index].base_stat;

                    return renderStatBar(statName, stat1, stat2);
                })}
            </div>
        </div>
    );
}

export default StatsComparator;
