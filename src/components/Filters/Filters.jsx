import { useState } from "react";
import { Link } from "react-router-dom";
import colors from "../../constants/colors";
import styles from "./Filters.module.css";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { TbAbacus } from "react-icons/tb";

function Filters({
    selectedTypes,
    handleTypeSelection,
    types,
    searchTerm,
    setSearchTerm,
    isComparatorOpen,
    setIsComparatorOpen,
}) {
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const capitalizeFirstLetter = (string) =>
        string.charAt(0).toUpperCase() + string.slice(1);

    if (types.length === 0) {
        return null;
    }

    return (
        <div className={styles.filterContainer}>
            <div className={styles.buttonsContainer}>
                <input
                    type="text"
                    name="pokemon"
                    id="pokemon"
                    placeholder="Search Pokémon:"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={styles.toggleButton}
                >
                    {isFilterOpen ? (
                        <>
                            <IoMdClose /> Hide Filters
                        </>
                    ) : (
                        <>
                            <IoMdMenu /> Show Filters
                        </>
                    )}
                </button>
                <button
                    className={`${styles.comparator} ${
                        isComparatorOpen
                            ? styles.activeComparator
                            : styles.closedComparator
                    }`}
                    style={isComparatorOpen == null ? { display: "none" } : {}}
                    onClick={() => {
                        isComparatorOpen
                            ? setIsComparatorOpen(false)
                            : setIsComparatorOpen(true);
                    }}
                >
                    Compare Pokémons <TbAbacus />
                </button>
            </div>

            {isFilterOpen && (
                <div className={styles.filter}>
                    <button
                        onClick={() => handleTypeSelection("all")}
                        className={
                            selectedTypes.length === 0
                                ? styles.active
                                : undefined
                        }
                    >
                        All
                    </button>

                    {types.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => handleTypeSelection(type.name)}
                            style={{
                                backgroundColor:
                                    colors[type.name] || "lightgray",
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
        </div>
    );
}

export default Filters;
