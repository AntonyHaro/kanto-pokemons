import { GoogleGenerativeAI } from "@google/generative-ai";

export const gemini = async (pokemon1, pokemon2) => {
    const apiKey = import.meta.env.VITE_GEMINI_API;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Function to format Pokémon data
    const formatPokemonData = (pokemon) => {
        return `
        Name: ${pokemon.name}
        Types: ${pokemon.types.map((type) => type.type.name).join(", ")}
        Abilities: ${pokemon.abilities
            .map((ability) => ability.ability.name)
            .join(", ")}
        Base Stats: 
        - Attack: ${
            pokemon.stats.find((stat) => stat.stat.name === "attack").base_stat
        }
        - Defense: ${
            pokemon.stats.find((stat) => stat.stat.name === "defense").base_stat
        }
        - HP: ${pokemon.stats.find((stat) => stat.stat.name === "hp").base_stat}
        - Special Attack: ${
            pokemon.stats.find((stat) => stat.stat.name === "special-attack")
                .base_stat
        }
        - Special Defense: ${
            pokemon.stats.find((stat) => stat.stat.name === "special-defense")
                .base_stat
        }
        `;
    };

    const pokemon1Data = formatPokemonData(pokemon1);
    const pokemon2Data = formatPokemonData(pokemon2);

    const prompt = `
    You are generating content for a website that compares Pokémon. 
    ⚠️ **Important instructions**:
    - Do not mention or assume that any information is missing or that more parameters are required for an assertive answer.
    - The analysis must focus solely on the given context and remain on the topic of comparing Pokémon.
    - Do not include any markdown formatting or additional text. Provide an objective response only.
    - Consider the usefulness of the Pokémon for a team.

    Pokémon 1:
    ${pokemon1Data}

    Pokémon 2:
    ${pokemon2Data}

    Generate a response in 80 words.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
};
