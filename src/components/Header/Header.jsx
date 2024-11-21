import { Link } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";
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
                    Kanto Pokémons
                </h1>

                <nav>
                    <a>
                        <Link to="/favorites" className={styles.link}>
                            Favorites
                        </Link>
                    </a>
                    <a>
                        <Link to="/favorites" className={styles.link}>
                            Teams
                        </Link>
                    </a>
                </nav>

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
