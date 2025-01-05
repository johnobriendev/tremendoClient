import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import { BsThreeDots } from "react-icons/bs";
import { useTheme } from '../context/ThemeContext.jsx';

function List({ list, cards, newCardName, editListName, setEditListName, setNewCardName, handleCreateCard, handleDeleteList, handleListNameChange, handleUpdateCard, handleDeleteCard, index}) {
  
  const { colors, accent } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [listColor, setListColor] = useState(list.color || 'bg-gray-800');
  const [showCardInput, setShowCardInput] = useState(false);

  const listCards = cards.filter(card => card.listId === list._id).sort((a, b) => a.position - b.position);

  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const cardInputRef = useRef(null);
  const addCardButtonRef = useRef(null);
  
 
  
  const handleListNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleListNameChange(list._id, editListName[list._id]);
      e.target.blur(); // Remove focus from the input field
    }
  };

  useEffect(() => {
    if (showCardInput && cardInputRef.current) {
      cardInputRef.current.focus();
    }
  }, [showCardInput]);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
    if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
    if (cardInputRef.current && !cardInputRef.current.contains(event.target) && !addCardButtonRef.current.contains(event.target)) {
      setShowCardInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, showCardInput]);


  const handleDeleteClick = () => {
    setShowModal(true);
    setMenuOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteList(list._id);
    setShowModal(false);
  };

  const handleAddCardKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateCard(list._id);
    }
  };


  // const handleColorChange = (listId, newColor) => {
    
  //   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  //   // Send the update request to the backend
  //   fetch(`${apiBaseUrl}/lists/${listId}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //     },
  //     body: JSON.stringify({ color: newColor }),
  //   })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setListColor(newColor);
  //     console.log('List color updated:', data);
  //   })
  //   .catch((error) => {
  //     console.error('Error updating list color:', error);
  //   });
  // };

  // useEffect(() => {
  //   if (list.color) {
  //     setListColor(list.color || null);
  //   }
  // }, [list.color]);

  return (
    <Draggable draggableId={list._id} index={index} type="LIST">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative shadow rounded-md p-2 w-[264px] max-h-[calc(100vh-6rem)] flex flex-col"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            transition: 'background-color 0.2s, color 0.2s',
            position:'relative',
            zIndex: snapshot.isDragging ? 30 : 1,
            ...provided.draggableProps.style
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-4 ">
            <input
              type="text"
              value={editListName[list._id] || list.name}
              onChange={(e) => setEditListName({ ...editListName, [list._id]: e.target.value })}
              onBlur={() => handleListNameChange(list._id, editListName[list._id])}
              onKeyPress={handleListNameKeyPress}
              placeholder="List Name"
              className="p-2 rounded w-full"
              style={{
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary,
                transition: 'background-color 0.2s, color 0.2s'
              }}
            />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:opacity-80 transition-opacity"
                style={{ color: colors.text.secondary }}
              >
                <BsThreeDots />
              </button>
              {menuOpen && (
                <div 
                className="absolute -right-24 mt-2 w-48 rounded shadow-lg"
                style={{
                  backgroundColor: colors.background.tertiary,
                  color: colors.text.primary,
                  transition: 'background-color 0.2s, color 0.2s',
                  zIndex: 60
                }}
                >
                  <button
                    onClick={handleDeleteClick}
                    className="block px-4 py-2 text-red-500 hover:bg-gray-600 w-full text-left"
                  >
                    Delete List
                  </button>
                  {/* <button
                    onClick={() => handleColorChange(list._id, '')}
                    className="block px-4 py-2 text-blue-500 hover:bg-gray-600 w-full text-left"
                  >
                    Clear List Color
                  </button>
                  <div className="block px-4 py-2 hover:bg-gray-600 w-full text-left">
                    <label className="block text-gray-400 mb-2">List Color</label>
                    <input
                      type="color"
                      className="w-16 h-8"
                      value={listColor}
                      onChange={(e) => handleColorChange(list._id, e.target.value)}
                      // onChange={(e) => setListColor(e.target.value)}
                    />
                  </div> */}
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-600 w-full text-left"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
          <Droppable droppableId={list._id} type="CARD">
            {(provided) => (
              <div
                className={`relative overflow-y-auto p-2 flex-grow mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 ${snapshot.isDraggingOver ? 'bg-gray-800' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="space-y-2 ">
                  {listCards.map((card, cardIndex) => (
                    <Card 
                      key={card._id} 
                      card={card} 
                      index={cardIndex} 
                      onUpdateCard={handleUpdateCard}
                      onDeleteCard={handleDeleteCard}
                  
                    />
                  ))}
                  {provided.placeholder}
                </div>
               
              </div>
            )}
          </Droppable>
          <div className="mt-4">
                {showCardInput ? (
                    <div >
                      <input
                        type="text"
                        value={newCardName[list._id] || ''}
                        onChange={(e) => setNewCardName({ ...newCardName, [list._id]: e.target.value })}
                        onKeyPress={handleAddCardKeyPress}
                        placeholder="New Card Name"
                        className="w-full p-2 rounded mb-2"
                        style={{
                          backgroundColor: colors.background.tertiary,
                          color: colors.text.primary,
                          transition: 'background-color 0.2s, color 0.2s'
                        }}
                        ref={cardInputRef}
                      />
                      <button
                        onClick={() => handleCreateCard(list._id)}
                        className="px-4 py-2 rounded hover:opacity-90 transition-opacity"
                        style={{
                          backgroundColor: accent.primary,
                          color: '#ffffff'
                        }}
                        ref={addCardButtonRef}
                      >
                        Add Card
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCardInput(true)}
                      className="px-4 py-2 rounded hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: accent.primary,
                        color: '#ffffff'
                      }}
                    >
                      Add Card
                    </button>
                  )}
           </div>
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div 
              className="p-6 rounded-md shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                transition: 'background-color 0.2s, color 0.2s',
                zIndex: 80

              }}
              ref={modalRef}
              >
                <h2 className="text-lg mb-4">Are you sure you want to delete this list?</h2>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded hover:opacity-90 mr-4"
                  style={{
                    backgroundColor: accent.danger,
                    color: '#ffffff'
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded hover:opacity-90"
                  style={{
                    backgroundColor: accent.primary,
                    color: '#ffffff'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default List;




