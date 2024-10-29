import SearchInput from "../SearchInput/SearchInput";
import styles from "./Header.module.css";

function Header({ searchTerm, setSearchTerm }) {
    return (
        <header className={styles.header}>
            <div className={styles.flex_container}>
                <h1>
                    Kanto Pokémons <button id="theme-toggle"></button>
                </h1>

                <SearchInput 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />
            </div>
            <hr />
        </header>
    )
}

export default Header;
