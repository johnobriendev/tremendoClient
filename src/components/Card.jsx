import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MdOutlineModeEdit } from "react-icons/md";


function Card({ card, index, onUpdateCard, onDeleteCard }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(card.name);

  const handleEditClick = () => {
    setEditingName(true);
    setShowOptions(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

 
  const handleCloseOptions = () => {
    setShowOptions(false);
    setEditingName(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleSaveName = async () => {
    try {
      await onUpdateCard(card._id, { name: newName });
      setEditingName(false);
      setShowOptions(false);
    } catch (error) {
      console.error("Error updating card name:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDeleteCard(card._id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };


  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative bg-gray-100 p-4 rounded mb-2 shadow hover:border hover:border-gray-400 group transition-transform duration-300 ease-in-out flex justify-between items-center"
        >
          <div className="flex justify-between items-center w-full">
            {editingName ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleSaveName}
                  className="bg-transparent border-none focus:outline-none flex-grow"
                />
              ) : (
                <span className="flex-grow">{card.name}</span>
              )}
            <MdOutlineModeEdit
              onClick={handleEditClick}
              className="text-gray-500 invisible group-hover:visible cursor-pointer transition-transform duration-300 ease-in-out"
              size={20}
            />
          </div>
          
          {/* Options Menu */}
          {showOptions && (
            <div className="absolute top-10 right-2 bg-white shadow-lg rounded border border-gray-300 p-2 z-10">
              <button
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-800"
              >
                Delete Card
              </button>
              {/* Add other options here */}
              <button onClick={handleCloseOptions} className="text-gray-600 hover:text-gray-900">
                Close
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
              <div className="bg-white p-6 rounded shadow-lg">
                <p className="text-lg mb-4">Are you sure you want to delete this card?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleCloseDeleteModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Card;



// import React from 'react';
// import { Draggable } from 'react-beautiful-dnd';

// function Card({ card, index }) {
//   return (
//     <Draggable draggableId={card._id} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="bg-gray-100 p-2 rounded mb-2 shadow"
//         >
//           {card.name}
//         </div>
//       )}
//     </Draggable>
//   );
// }

// export default Card;

