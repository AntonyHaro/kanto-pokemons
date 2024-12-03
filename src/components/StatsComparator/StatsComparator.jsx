import styles from "./StatsComparator.module.css";
import { capitalizeFirstLetter } from "../../utils/utils";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar os componentes necessários para o Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function StatsComparator({ pokemon1, pokemon2 }) {
    if (!pokemon1 || !pokemon2) {
        return <p>Loading Pokémon data for comparison...</p>;
    }

    // Cria dados para o gráfico de setores de cada estatística
    const generatePieChartData = (statName, stat1, stat2) => ({
        labels: [
            capitalizeFirstLetter(pokemon1.name),
            capitalizeFirstLetter(pokemon2.name),
        ],
        datasets: [
            {
                data: [stat1, stat2],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.8)", // Azul suave
                    "rgba(255, 99, 132, 0.8)", // Vermelho suave
                ],
                borderColor: [
                    "rgba(54, 162, 235, 1)", // Azul
                    "rgba(255, 99, 132, 1)", // Vermelho
                ],
                borderWidth: 2,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
            },
            legend: {
                position: "top",
                labels: {
                    boxWidth: 10,
                    padding: 20,
                    font: {
                        size: 14,
                    },
                },
            },
        },
        animation: {
            duration: 1000, // Animação suave no gráfico
            easing: "easeInOutQuad",
        },
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

                    const pieChartData = generatePieChartData(
                        statName,
                        stat1,
                        stat2
                    );

                    return (
                        <div className={styles.statChart} key={statName}>
                            <h3>{statName}</h3>
                            <Pie data={pieChartData} options={chartOptions} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StatsComparator;
