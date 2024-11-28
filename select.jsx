import React, { useState } from "react";

// Componente Card
const Card = ({ id, content, onSelect, isSelected }) => {
    return (
        <div
            style={{
                padding: "20px",
                margin: "10px",
                border: isSelected ? "2px solid blue" : "2px solid gray",
                cursor: "pointer",
                display: "inline-block",
            }}
            onClick={() => onSelect(id)}
        >
            <h3>{content}</h3>
        </div>
    );
};

// Componente principal
const CardSelection = () => {
    // Estado para armazenar os cards selecionados
    const [selectedCards, setSelectedCards] = useState([]);

    // Lista de cards (exemplo)
    const cards = [
        { id: 1, content: "Card 1" },
        { id: 2, content: "Card 2" },
        { id: 3, content: "Card 3" },
        { id: 4, content: "Card 4" },
    ];

    // Função para lidar com a seleção de um card
    const handleSelectCard = (id) => {
        setSelectedCards((prevSelected) => {
            // Se o card já estiver selecionado, removê-lo
            if (prevSelected.includes(id)) {
                return prevSelected.filter((cardId) => cardId !== id);
            }
            // Se menos de 2 cards estão selecionados, adicioná-lo
            if (prevSelected.length < 2) {
                return [...prevSelected, id];
            }
            // Se já houver 2 cards selecionados, não adicionar mais
            return prevSelected;
        });
    };

    // Função para remover um card da seleção
    const handleRemoveCard = (id) => {
        setSelectedCards((prevSelected) => {
            return prevSelected.filter((cardId) => cardId !== id);
        });
    };

    // Mapear cards e passar os dados necessários para cada um
    return (
        <div>
            <h2>Selecione até 2 cards</h2>
            <div>
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        id={card.id}
                        content={card.content}
                        onSelect={handleSelectCard}
                        isSelected={selectedCards.includes(card.id)}
                    />
                ))}
            </div>
            <div>
                <h3>Cards Selecionados:</h3>
                <ul>
                    {cards
                        .filter((card) => selectedCards.includes(card.id))
                        .map((card) => (
                            <li
                                key={card.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <span>{card.content}</span>
                                <button
                                    onClick={() => handleRemoveCard(card.id)}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default CardSelection;
