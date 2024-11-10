import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MdOutlineModeEdit, MdSave } from "react-icons/md";

import { IoMdClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";




function Card({ card, index, onUpdateCard, onDeleteCard, theme }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(card.name);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDescriptionChanged, setIsDescriptionChanged] = useState(false);

 

  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);
  const deleteModalRef = useRef(null);
  const contentRef = useRef(null);
  const detailModalRef = useRef(null);



  const getCardStyles = (isDark) => ({
    backgroundColor: isDark ? '#374151' : '#EDF2F7', //#212938 #bcc5d7
    color: isDark ? '#CBD5E0' : '#1A202C',
  });

  //calculates the position of the edit card menu
  const updateMenuPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8, // 8px offset from the card
      });
    }
  };

  //calculates the height of the text area when card is being edited
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      // Reset height to auto to get the correct scrollHeight
      inputRef.current.style.height = 'auto';
      // Set the height to match the scrollHeight
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };


  //saves the edited card onblur
  const handleSaveAndClose = async (e) => {
      // Check if the blur event is caused by the delete button being clicked
    if (e && e.relatedTarget && e.relatedTarget.id === 'delete-button') {
      return; // Skip saving and closing if the delete button is clicked
    }
    
    if (editingName && newName !== card.name) {
      try {
        await onUpdateCard(card._id, { name: newName });
      } catch (error) {
        console.error("Error updating card name:", error);
      }
    }
    setEditingName(false);
    setShowOptions(false);
  };

  //click outside and scroll events to close the card menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        handleSaveAndClose();
      }
      if (showOptions && optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
      if (showDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
        setShowDeleteModal(false);
      }
    };

    const handleScroll = () => {
      if (showOptions) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showOptions, showDeleteModal]);

  //click event to close the card description modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDetailModal && detailModalRef.current && !detailModalRef.current.contains(event.target)) {
        setShowDetailModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetailModal]);

  // Update menu position when options are shown
  useEffect(() => {
    if (showOptions) {
      updateMenuPosition();
    }
  }, [showOptions]);
  
  //calls the adjust height function whenever a card is being edited
  useEffect(() => {
    if (editingName) {
      adjustTextareaHeight();
    }
  }, [editingName, newName]);


  //shows the card menu when edit button is clicked
  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowOptions(true); // Toggle options menu
    if (!showOptions) {
      setEditingName(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  };

  //shows the delete modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowOptions(false); // Close options menu
    handleSaveAndClose();
  };


  //actually deletes the card
  const handleDeleteConfirm = async () => {
    try {
      await onDeleteCard(card._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  //opens up the card description modal when the card is clicked 
  const handleCardClick = (e) => {
    // Don't open modal if clicking edit button or options menu
    if (e.target.closest('.edit-button') || e.target.closest('.options-menu')) {
      return;
    }
    setShowDetailModal(true);
  };

  //calculates if the current description has changed
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setIsDescriptionChanged(true);
  };

  //saves the description only if it has changed
  const handleDescriptionSave = async () => {
    if (!isDescriptionChanged) return;

    setIsLoading(true);
    try {
      await onUpdateCard(card._id, { description });
      setIsDescriptionChanged(false);
    } catch (error) {
      console.error("Error updating description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //adds a comment to the card
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/cards/cards/${card._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error(`Error adding comment: ${response.statusText}`);
      }

      const updatedCard = await response.json();
      onUpdateCard(card._id, updatedCard); // Update local state with the returned card
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //deletes comment from the card
  const handleDeleteComment = async (commentId) => {
    setIsLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/cards/cards/${card._id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting comment: ${response.statusText}`);
      }

      const updatedCard = await response.json();
      onUpdateCard(card._id, updatedCard); // Update local state with the returned card
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          // ref={provided.innerRef}
          // ref={cardRef}
          ref={(el) => {
            cardRef.current = el;
            provided.innerRef(el);
          }}

          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2  rounded mb-2 shadow hover:border hover:border-gray-500 group transition-transform duration-300 ease-in-out  ${snapshot.isDragging ? 'z-[90]' : 'z-20'}`}
          style={{
            ...getCardStyles(theme === 'dark'),
            ...provided.draggableProps.style // This line is crucial
          }}
          //onClick={handleCardClick}
        >
          <div className=" w-full relative text-sm">
            {editingName ? (
                <textarea
                  ref={inputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleSaveAndClose}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSaveAndClose(); // Save and close when Enter is pressed
                    }
                  }}
                  className={` ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-[#e4eef5] text-black'
                  } border-none focus:outline-none w-full resize-none p-0 z-10`}
                  style={{ minHeight: textareaHeight }}
                />
              ) : (
                <div ref={contentRef} className='' onClick={handleCardClick}>
                  <span className="block">{card.name}</span>
                  <MdOutlineModeEdit
                    onClick={handleEditClick}
                    className="text-gray-400 absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 group-hover:bg-gray-600 hover:text-white group-hover:rounded-lg cursor-pointer transition-opacity duration-300 ease-in-out"
                    size={25}
                  />
                </div>
              )}
           
          </div>

          {/* Detail Modal */}
          {showDetailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div 
                ref={detailModalRef}
                className={`w-11/12 max-w-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-xl p-6`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{card.name}</h2>
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <IoMdClose size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <div className="flex flex-col">
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      className={`w-full p-2 rounded mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${isLoading ? 'opacity-50' : ''}`}
                      rows={4}
                      placeholder="Add a description..."
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleDescriptionSave}
                      className={`flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${isLoading || !isDescriptionChanged ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading || !isDescriptionChanged}
                    >
                      <MdSave className="mr-2" />
                      Save Description
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Comments</h3>
                  <div className="space-y-4 mb-4">
                    {card.comments && card.comments.map((comment) => (
                      <div key={comment._id} className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-start">
                          <p className="flex-grow">{comment.text}</p>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className={`text-red-500 hover:text-red-700 ml-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>


                  <div className="mb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className={`w-full p-2 rounded mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${isLoading ? 'opacity-50' : ''}`}
                      rows={2}
                      placeholder="Write a comment..."
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleAddComment}
                      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                    >
                      Add Comment
                    </button>
                  </div>

               
                </div>
              </div>
            </div>
          )}

      
          
          {/* Options Menu */}

          {showOptions && (
            <div
              ref={optionsRef}
              style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                zIndex: 100,
              }}          
              className={`${
                theme === 'dark' ? 'bg-[#345576] text-white' : 'bg-[#e4eef5] text-black'
              }absolute top-0 -right-16 w-36 shadow-lg rounded border border-gray-200 p-1 z-[100]`}
            >
              <button
                id="delete-button"
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-800 w-full "
              >
                Delete Card
              </button>
              <button 
                onClick={() => setShowOptions(false)} 
                className={`${
                  theme === 'dark' ? ' text-white' : ' text-black'
                } hover:text-gray-900 w-full `} 
              >
                Close
              </button>
            </div>
          )}

         

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
              <div ref={deleteModalRef} className={` p-6 rounded shadow-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-[#e4eef5]'
                        } `}>
                <p className="text-lg mb-4">Are you sure you want to delete this card?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
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




