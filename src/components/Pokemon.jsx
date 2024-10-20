function Pokemon({ pokemon }) {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const types = pokemon.types
        .map((item) => capitalizeFirstLetter(item.type.name))
        .join(", ");

    return (
        <li>
            <p className="name">{capitalizeFirstLetter(pokemon.name)}</p>
            <img src={pokemon.sprites["front_default"]} alt={pokemon.name} />
            <p>{types}</p>
        </li>
    );
}

export default Pokemon;
