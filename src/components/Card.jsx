import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MdOutlineModeEdit } from "react-icons/md";


function Card({ card, index, onUpdateCard, onDeleteCard }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(card.name);

  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);
  // const deleteButtonRef = useRef(null);
  const deleteModalRef = useRef(null);
  //const contentRef = useRef(null);


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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions, showDeleteModal]);

  // useEffect(() => {
  //   if (editingName && textareaRef.current) {
  //     textareaRef.current.focus();
  //     textareaRef.current.select();
  //   }
  // }, [editingName]);

  // useEffect(() => {
  //   if (editingName && textareaRef.current && contentRef.current) {
  //     const content = contentRef.current;
  //     const textarea = textareaRef.current;
      
  //     // Match width
  //     textarea.style.width = `${content.offsetWidth}px`;
      
  //     // Match height
  //     textarea.style.height = 'auto';
  //     textarea.style.height = `${content.offsetHeight}px`;
      
  //     // Focus and select text
  //     textarea.focus();
  //     textarea.select();
  //   }
  // }, [editingName]);

  // const handleTextareaChange = (e) => {
  //   setNewName(e.target.value);
  //   e.target.style.height = 'auto';
  //   e.target.style.height = `${e.target.scrollHeight}px`;
  // };



  const handleEditClick = () => {
    setEditingName(true);
    setShowOptions(true);
    setTimeout(() => {
      
        inputRef.current.focus();
        inputRef.current.select();
     
    }, 0);
    //deleting this fixed modal errors with onblur
  };
  const handleDeleteClick = () => {
  
    setShowDeleteModal(true);
    setShowOptions(false); // Close options menu
    handleSaveAndClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDeleteCard(card._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  


  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          // ref={(el) => {
          //   provided.innerRef(el);
          //   cardRef.current = el;
          // }}

          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative bg-gray-100 p-4  rounded mb-2 shadow hover:border hover:border-gray-400 group transition-transform duration-300 ease-in-out flex justify-between items-center"
          
        >
          <div className=" relative  w-full z-0">
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
                  className="bg-transparent border-none focus:outline-none w-full resize-none overflow-hidden p-0"
                />
              ) : (
                <span className="block pr-8 ">{card.name}</span>
              )}
            <MdOutlineModeEdit
              onClick={handleEditClick}
              className="text-gray-500 absolute -top-2 -right-2  opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 ease-in-out"
              size={20}
            />
          </div>
          
          {/* Options Menu */}
          {showOptions && (
            <div 
            ref={optionsRef} 
            className="absolute top-0 -right-24 bg-white shadow-lg rounded border border-gray-300 p-2 z-10 flex flex-col">
              <button
                id='delete-button'
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-800"
              >
                Delete Card
              </button>
              {/* Add other options here */}
              <button onClick={() => setShowOptions(false)} className="text-gray-600 hover:text-gray-900">
                Close
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
              <div ref={deleteModalRef} className="bg-white p-6 rounded shadow-lg">
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




