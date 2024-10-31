import colors from "../../constants/colors";
import styles from "./Filters.module.css";

function Filters({ selectedTypes, handleTypeSelection, types, isFilterOpen }) {
    const capitalizeFirstLetter = (string) =>
        string.charAt(0).toUpperCase() + string.slice(1);

    if (types.length === 0) {
        return null;
    }

    return (
        <>
            {isFilterOpen && (
                <div className={styles.filter_container}>
                    <button
                        onClick={() => handleTypeSelection("all")}
                        className={selectedTypes.length === 0 ? styles.active : undefined}
                    >
                        All
                    </button>

                    {types.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => handleTypeSelection(type.name)}
                            style={{
                                backgroundColor: colors[type.name] || "lightgray",
                            }}
                            className={
                                selectedTypes.includes(type.name)
                                    ? styles.active
                                    : undefined
                            }
                        >
                            {capitalizeFirstLetter(type.name)}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}

export default Filters;
