import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import PokemonList from "../../components/PokemonsList/PokemonsList";
import styles from "./Favorites.module.css";

function Favorites() {
    return (
        <div className={styles.favorites}>
            <header>
                <Link to={`/`} className={styles.backButton}>
                    <IoIosArrowBack /> Back to Pokémon
                </Link>
                <h1>Favorites</h1>
            </header>

            {/* <PokemonList pokemons={pokemons} /> */}
        </div>
    );
}

export default Favorites;
