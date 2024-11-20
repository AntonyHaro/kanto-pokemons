import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import PokemonList from "../../components/PokemonsList/PokemonsList";
import styles from "./Favorites.module.css";

function Favorites() {
    const favoritePokemons =
        JSON.parse(localStorage.getItem("favoritePokemons")) || [];

    return (
        <div className={styles.favorites}>
            <header>
                <Link to={`/`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Home
                </Link>
                <h1>
                    Favorite Pokémons <FaStar />
                </h1>
            </header>

            <PokemonList pokemons={favoritePokemons} />
        </div>
    );
}

export default Favorites;
