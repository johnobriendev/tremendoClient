import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from './Card';

function List({ list, cards, newCardName, editListName, setEditListName, setNewCardName, handleCreateCard, handleDeleteList, handleListNameChange }) {
  const listCards = cards.filter(card => card.listId === list._id).sort((a, b) => a.position - b.position);

  return (
    <Draggable draggableId={list._id} index={list.position - 1}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white shadow rounded-md p-4 w-80"
        >
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={editListName[list._id] || list.name}
              onChange={(e) => setEditListName({ ...editListName, [list._id]: e.target.value })}
              onBlur={() => handleListNameChange(list._id, editListName[list._id])}
              placeholder="List Name"
              className="p-2 border rounded w-full"
            />
            <button
              onClick={() => handleDeleteList(list._id)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
          <Droppable droppableId={list._id} type="CARD">
            {(provided) => (
              <div
                className="space-y-2"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {listCards.map((card, index) => (
                  <Card key={card._id} card={card} index={index} />
                ))}
                {provided.placeholder}
                <div className="mt-4">
                  <input
                    type="text"
                    value={newCardName[list._id] || ''}
                    onChange={(e) => setNewCardName({ ...newCardName, [list._id]: e.target.value })}
                    placeholder="New Card Name"
                    className="p-2 border rounded w-full"
                  />
                  <button
                    onClick={() => handleCreateCard(list._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default List;


// // List.js
// import React from 'react';
// import { Droppable } from 'react-beautiful-dnd';
// import Card from './Card';

// const List = ({ list, cards, handleListNameChange, handleDeleteList, newCardName, setNewCardName, handleCreateCard }) => {
//   return (
//     <div className="bg-white rounded shadow-md p-4 w-72">
//       <Droppable droppableId={list._id}>
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             <div className="flex justify-between items-center mb-4">
//               <input
//                 type="text"
//                 value={list.name}
//                 onChange={(e) => handleListNameChange(list._id, e.target.value)}
//                 className="p-2 border rounded w-full"
//               />
//               <button
//                 onClick={() => handleDeleteList(list._id)}
//                 className="ml-2 text-red-500 hover:text-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//             {cards
//               .filter((card) => card.listId === list._id)
//               .sort((a, b) => a.position - b.position)
//               .map((card, index) => (
//                 <Card key={card._id} card={card} index={index} />
//               ))}
//             {provided.placeholder}
//             <div className="mt-4">
//               <input
//                 type="text"
//                 value={newCardName[list._id] || ''}
//                 onChange={(e) => setNewCardName({ ...newCardName, [list._id]: e.target.value })}
//                 placeholder="New Card Name"
//                 className="p-2 border rounded w-full"
//               />
//               <button
//                 onClick={() => handleCreateCard(list._id)}
//                 className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600 w-full"
//               >
//                 Create Card
//               </button>
//             </div>
//           </div>
//         )}
//       </Droppable>
//     </div>
//   );
// };

// export default List;
