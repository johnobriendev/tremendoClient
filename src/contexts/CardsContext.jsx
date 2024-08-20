// src/contexts/CardsContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const CardsContext = createContext();

// Create the provider component
export const CardsProvider = ({ children }) => {
  const [cards, setCards] = useState([]);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  const updateCard = (updatedCard) => {
    setCards(cards.map(card => card._id === updatedCard._id ? updatedCard : card));
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter(card => card._id !== cardId));
  };

  return (
    <CardsContext.Provider value={{ cards, setCards, addCard, updateCard, deleteCard }}>
      {children}
    </CardsContext.Provider>
  );
};
