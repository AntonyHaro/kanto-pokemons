import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { FaUsers } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
import TeamsContainer from "../../components/TeamsContainer/TeamsContainer";
import styles from "./Teams.module.css";

function Teams() {
    const [teams, setTeams] = useState([]);

    // Carregar os times do localStorage ao montar o componente
    useEffect(() => {
        const savedTeams = JSON.parse(localStorage.getItem("teams")) || [];
        setTeams(savedTeams);
    }, []);

    // Criar um novo time
    const createTeam = () => {
        const newTeam = [null, null, null, null, null, null];
        const updatedTeams = [...teams, newTeam];

        // Atualizar estado e localStorage
        setTeams(updatedTeams);
        localStorage.setItem("teams", JSON.stringify(updatedTeams));
    };

    return (
        <div className={styles.team}>
            <Header />
            <header className={styles.header}>
                <div className={styles.flexContainer}>
                    <h1>
                        Your Teams <FaUsers />
                    </h1>
                    <button className={styles.addButton} onClick={createTeam}>
                        Create Team <IoAddCircleOutline />
                    </button>
                </div>
            </header>
            <TeamsContainer teams={teams} />
        </div>
    );
}

export default Teams;
