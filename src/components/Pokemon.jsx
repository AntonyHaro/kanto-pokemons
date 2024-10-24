import { useNavigate } from "react-router-dom";

function Pokemon({ pokemon }) {
    const navigate = useNavigate();
    
    const colors = {
        fire: "hsla(0, 100%, 50%, 0.2)",
        grass: "hsla(128, 43%, 53%, 0.2)",
        electric: "hsla(35, 100%, 57%, 0.2)",
        water: "hsla(214, 78%, 20%, 0.2)",
        ground: "hsla(30, 28%, 48%, 0.2)",
        rock: "hsla(0, 0%, 50%, 0.2)",
        fairy: "hsla(291, 31%, 65%, 0.2)",
        poison: "hsla(132, 100%, 66%, 0.2)",
        bug: "hsla(35, 100%, 76%, 0.2)",
        dragon: "hsla(219, 67%, 75%, 0.2)",
        psychic: "hsla(62, 35%, 69%, 0.2)",
        flying: "hsla(0, 0%, 85%, 0.2)",
        fighting: "hsla(40, 14%, 64%, 0.2)",
        normal: "hsla(0, 50%, 10%, 0.2)",
        ghost: "hsla(271, 34%, 53%, 0.2)",
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const playSound = async (id) => {
        const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
        try {
            const audio = new Audio(soundUrl);
            await audio
                .play()
                .catch((err) => console.error("Playback failed:", err));
        } catch (error) {
            console.error("Erro ao tocar áudio:", error);
        }
    };

    const primaryType = pokemon.types[0].type.name;

    const types = pokemon.types
        .map((item) => capitalizeFirstLetter(item.type.name))
        .join(", ");

    const handleClick = () => {
        playSound(pokemon.id);
        navigate(`/pokemoninfo/${pokemon.id}`);
    }

    return (
        <li
            style={{ backgroundColor: colors[primaryType] }}
            onClick={handleClick}
        >
            <p className="name">{capitalizeFirstLetter(pokemon.name)}</p>
            <img src={pokemon.sprites["front_default"]} alt={pokemon.name} />
            <p>{types}</p>
        </li>
    );
}

export default Pokemon;
