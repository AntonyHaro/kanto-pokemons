import colors from "../../constants/colors";
import styles from "./Filters.module.css";

function Filters({ selectedType, setSelectedType, types, pokemons }) {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    return (
        <div className={styles.filter_container}>
            <button onClick={() => setSelectedType("")} className={selectedType === "" ? styles.active : ""}>All</button>

            {types.map((type) => {
                const hasPokemonsOfType = pokemons.some((pokemon) =>
                    pokemon.types.some((pokemonType) => pokemonType.type.name === type.name)
                );

                return hasPokemonsOfType ? (
                    <button
                        key={type.name}
                        onClick={() => setSelectedType(type.name)}
                        style={{
                            backgroundColor: colors[type.name]
                        }}
                        className={selectedType === type.name ? styles.active : ""}
                    >
                        {capitalizeFirstLetter(type.name)}
                    </button>
                ) : null;
            })}

        </div>
    )
}

export default Filters;
