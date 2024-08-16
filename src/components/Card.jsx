import React from 'react';

const Card = ({ card }) => {
  return (
    <div className="border p-2 mt-2 bg-gray-100 rounded">
      <h3 className="font-bold">{card.name}</h3>
      <p>{card.description}</p>
    </div>
  );
};

export default Card;
