import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function Card({ card, index }) {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-100 p-2 rounded mb-2 shadow"
        >
          {card.name}
        </div>
      )}
    </Draggable>
  );
}

export default Card;

