import styles from "./TeamsContainer.module.css";

function TeamsContainer({ teams }) {
    return (
        <div className={styles.teamsContainer}>
            {teams.map((team, index) => (
                <Team key={index} team={team} />
            ))}
        </div>
    );
}

const Team = ({ team }) => {
    return (
        <div className={styles.team}>
            {team.map((pokemon, idx) => (
                <div key={idx} className={styles.pokemon}>
                    {pokemon ? pokemon.name : "Empty Slot"}
                </div>
            ))}
        </div>
    );
};

export default TeamsContainer;
