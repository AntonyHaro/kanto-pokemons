import { useNavigate } from "react-router-dom";

import colors from "../../constants/colors";

import "./Pokemon.css";

function Pokemon({ pokemon }) {
    const navigate = useNavigate();

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
        navigate(`/pokemon/${pokemon.id}`);
    }

    return (
        <li
            style={{ backgroundColor: colors[primaryType] }}
            onClick={handleClick}
            className="pokemon-card"
        >
            <p className="name">{capitalizeFirstLetter(pokemon.name)}</p>
            <img src={pokemon.sprites["front_default"]} alt={pokemon.name} />
            <p>{types}</p>
        </li>
    );
}

export default Pokemon;
