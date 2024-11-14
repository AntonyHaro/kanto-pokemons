import { IoMdMenu, IoMdClose } from "react-icons/io";
import styles from "./Header.module.css";
import pokeball from "../../assets/pokeball.svg";

function Header({ searchTerm, setSearchTerm, isFilterOpen, setIsFilterOpen }) {
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header>
            <div className={styles.flexContainer}>
                <h1>
                    <img src={pokeball} alt="" />
                    Kanto Pokémons
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

            <div className={styles.rowContainer}>
                <button
                    className={styles.filterBtn}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    {isFilterOpen ? <IoMdClose /> : <IoMdMenu />}
                </button>
            </div>
        </header>
    );
}

export default Header;
