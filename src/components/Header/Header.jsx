import styles from "./Header.module.css";

function Header({ searchTerm, setSearchTerm }) {
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header>
            <div className={styles.flexContainer}>
                <h1>
                    Kanto Pokémons <button id="theme-toggle"></button>
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
            <hr />
        </header>
    );
}

export default Header;
