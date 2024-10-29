import { FaSearch } from "react-icons/fa";
import styles from "./SearchInput.module.css";

function SearchInput({ searchTerm, setSearchTerm }) {
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className={styles.search_input_container}>
            <input
                type="text"
                name="pokemon"
                id="pokemon"
                placeholder="Search Pokémon"
                value={searchTerm} 
                onChange={handleInputChange}
            />
            <button>
                <FaSearch />
            </button>
        </div>
    );
}

export default SearchInput;
