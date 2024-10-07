import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MdOutlineModeEdit } from "react-icons/md";




function Card({ card, index, onUpdateCard, onDeleteCard, theme }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(card.name);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [textareaHeight, setTextareaHeight] = useState('auto');
 

  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);
  const deleteModalRef = useRef(null);
  const contentRef = useRef(null);



  const getCardStyles = (isDark) => ({
    backgroundColor: isDark ? '#374151' : '#EDF2F7', //#212938 #bcc5d7
    color: isDark ? '#CBD5E0' : '#1A202C',
  });

  const updateMenuPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8, // 8px offset from the card
      });
    }
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      // Reset height to auto to get the correct scrollHeight
      inputRef.current.style.height = 'auto';
      // Set the height to match the scrollHeight
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };



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

  // Update menu position when options are shown
  useEffect(() => {
    if (showOptions) {
      updateMenuPosition();
      // const scrollParent = cardRef.current.closest('.overflow-y-auto');
      // if (scrollParent) {
      //   scrollParent.addEventListener('scroll', updateMenuPosition);
      //   return () => scrollParent.removeEventListener('scroll', updateMenuPosition);
      // }
    }
  }, [showOptions]);

  useEffect(() => {
    if (editingName) {
      adjustTextareaHeight();
    }
  }, [editingName, newName]);


  // const handleEditClick = (e) => {
  //   e.stopPropagation();
  //   setEditingName(true);
  //   setShowOptions(true);

  //   setTimeout(() => {
      
  //       inputRef.current.focus();
  //       inputRef.current.select();
     
  //   }, 0);
  //   //deleting this fixed modal errors with onblur
  // };

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
          className={`p-1  rounded mb-2 shadow hover:border hover:border-gray-500 group transition-transform duration-300 ease-in-out  ${snapshot.isDragging ? 'z-[90]' : 'z-20'}`}
          style={{
            ...getCardStyles(theme === 'dark'),
            ...provided.draggableProps.style // This line is crucial
          }}
        >
          <div className=" w-full relative">
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
                <div ref={contentRef} className=''>
                  <span className="block pr-4">{card.name}</span>
                  <MdOutlineModeEdit
                    onClick={handleEditClick}
                    className="text-gray-400 absolute top-0 right-0  opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 ease-in-out"
                    size={20}
                  />
                </div>
              )}
           
          </div>

      
          
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




