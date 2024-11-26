import { MdCatchingPokemon } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import styles from "./TeamsContainer.module.css";

function TeamsContainer({ teams }) {
    return (
        <div className={styles.teamsContainer}>
            {teams.map((team, index) => (
                <Team key={index} team={team} index={index + 1} />
            ))}
        </div>
    );
}

const Team = ({ team, index }) => {
    return (
        <div className={styles.team}>
            <h2>
                <div className={styles.titleContainer}>
                    Team {index} <MdCatchingPokemon />
                </div>
                <button className={styles.deleteBtn}>
                    <FaTrash />
                </button>
            </h2>
            <div className={styles.pokemonContainer}>
                {team.map((pokemon, idx) => (
                    <div key={idx} className={styles.pokemon}>
                        {pokemon ? pokemon.name : "Empty Slot"}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamsContainer;
