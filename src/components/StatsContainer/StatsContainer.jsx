import maxStats from "../../constants/maxStats.js";
import colors from "../../constants/colors.js";
import { capitalizeFirstLetter } from "../../utils/utils.js";
import styles from "./StatsContainer.module.css";

function StatsContainer({ pokemon }) {
    const calculateStatBar = (stat, maxStat) => {
        return (stat / maxStat) * 100;
    };

    return (
        <section className={styles.statsContainer} id="stats">
            <h2>Stats</h2>
            <div className={styles.flexContainer}>
                {pokemon.stats.map((stat, index) => (
                    <div key={index} className={styles.stats}>
                        <strong className={styles.statName}>
                            {capitalizeFirstLetter(stat.stat.name)}:
                        </strong>
                        {/* <p className={styles.statInfo}>{stat.base_stat}</p> */}
                        <div className={styles.statBarContainer}>
                            <div className={styles.statBar}>
                                <div
                                    className={styles.statBarColored}
                                    style={{
                                        height: "100%",
                                        width: `${calculateStatBar(
                                            stat.base_stat,
                                            maxStats[index]
                                        )}%`,
                                        backgroundColor:
                                            colors[pokemon.types[0].type.name],
                                    }}
                                ></div>
                            </div>
                            <span>
                                {stat.base_stat} / {maxStats[index]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default StatsContainer;
