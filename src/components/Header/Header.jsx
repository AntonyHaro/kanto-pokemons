import { FaStar } from "react-icons/fa6";
import { GiPunchBlast, GiPokecog } from "react-icons/gi";
import { FaAppleAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { FaHome } from "react-icons/fa";

function Header({ searchTerm, setSearchTerm}) {
    return (
        <header className={styles.header}>
            <div className={styles.flexContainer}>
                <Link to="/" style={{textDecoration: "none"}}>
                    <h1>
                        <GiPokecog />
                        PokéMates
                    </h1>
                </Link>

                <nav>
                    <Link to="/" className={styles.link}>
                        Home <FaHome className={styles.home} />
                    </Link>

                    <Link to="/moves" className={styles.link}>
                        Moves <GiPunchBlast className={styles.moves} />
                    </Link>

                    <Link to="/berries" className={styles.link}>
                        Berries <FaAppleAlt className={styles.berries} />
                    </Link>

                    <Link to="/favorites" className={styles.link}>
                        Favorites <FaStar className={styles.star} />
                    </Link>
                </nav>

                {/* <input
                    type="text"
                    name="pokemon"
                    id="pokemon"
                    placeholder="Search Pokémon:"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={handleInputChange}
                /> */}
            </div>
        </header>
    );
}

export default Header;
