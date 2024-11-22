import styles from "./Header.module.css";
import pokeball from "../../assets/pokeball.svg";

function Header({ searchTerm, setSearchTerm, isFilterOpen, setIsFilterOpen }) {
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header className={styles.header}>
            <div className={styles.flexContainer}>
                <h1>
                    <img src={pokeball} alt="" />
                    PokéMates
                </h1>

                <input
                    type="text"
                    name="pokemon"
                    id="pokemon"
                    placeholder="Search Pokémon:"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
            </div>
        </header>
    );
}

export default Header;
