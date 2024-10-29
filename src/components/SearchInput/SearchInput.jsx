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
                placeholder="Search Pokémon:"
                autoComplete="off"
                value={searchTerm}
                onChange={handleInputChange}
            />
        </div>
    );
}

export default SearchInput;
