import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import PokemonList from "../../components/PokemonsList/PokemonsList";
import styles from "./Favorites.module.css";

function Favorites() {
    const favoritePokemons =
        JSON.parse(localStorage.getItem("favoritePokemons")) || [];

    return (
        <div className={styles.favorites}>
            <header>
                <Link to={`/`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Pokémon
                </Link>
                <h1>Favorite Pokémons</h1>
            </header>

            <PokemonList pokemons={favoritePokemons} />
        </div>
    );
}

export default Favorites;
