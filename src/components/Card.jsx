import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MdOutlineModeEdit, MdSave } from "react-icons/md";
import { getOrCreateModalRoot, registerPortalUser, unregisterPortalUser } from '../utils/portalManager';
import { addCardComment, deleteCardComment } from '../utils/api';

import { IoMdClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { useTheme } from '../context/ThemeContext.jsx';
import { createPortal } from 'react-dom';

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
  const [portalContainer, setPortalContainer] = useState(null);

  const { colors, accent } = useTheme();

  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);
  const deleteModalRef = useRef(null);
  const contentRef = useRef(null);
  const detailModalRef = useRef(null);


  useEffect(() => {
    // Register this component as a portal user when it mounts
    registerPortalUser();
    const modalRoot = getOrCreateModalRoot();
    setPortalContainer(modalRoot);

    // Clean up when the component unmounts
    return () => {
      unregisterPortalUser();
    };
  }, []); 

  

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



  const handleSaveAndClose = async (e) => {
      // Enhanced check for delete button click with optional chaining
      if (e?.relatedTarget?.id === 'delete-button') {
        setEditingName(false);  // NEW: Still close editing state
        return;  // NEW: But don't close options menu
      }
      
      if (editingName && newName !== card.name) {
        try {
          await onUpdateCard(card._id, { name: newName });
        } catch (error) {
          console.error("Error updating card name:", error);
        }
      }
      setEditingName(false);
      setShowOptions(false);  // Only closes options menu if not delete button
  };




  useEffect(() => {
      const handleClickOutside = (event) => {
        // First, check if we're clicking the delete button or modal
        // This is important to prevent unwanted modal closes
        const isClickingDeleteButton = event.target.closest('#delete-button');
        const isClickingDeleteModal = deleteModalRef.current?.contains(event.target);
        
        // If we're interacting with delete functionality, don't process other click handlers
        // This ensures the delete modal can appear and stay visible
        if (isClickingDeleteButton || isClickingDeleteModal) {
          return;
        }

        // Normal card editing blur handling
        if (cardRef.current && !cardRef.current.contains(event.target)) {
          handleSaveAndClose();
        }

        // Close options menu if clicking outside
        if (showOptions && optionsRef.current && !optionsRef.current.contains(event.target)) {
          setShowOptions(false);
        }

        // Only close delete modal if we're not clicking inside it
        if (showDeleteModal && !isClickingDeleteModal) {
          setShowDeleteModal(false);
        }
      };

      // Keep your existing scroll handler
      const handleScroll = () => {
        if (showOptions) {
          setShowOptions(false);
        }
      };

      // Add event listeners
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);

      // Clean up listeners on unmount
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
      };
  }, [showOptions, showDeleteModal]);


  //click event to close the card description/card detail modal
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
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setShowOptions(false); // Close options menu
    //handleSaveAndClose();
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsLoading(true);
    try {
      const updatedCard = await addCardComment(card._id, newComment);
      await onUpdateCard(card._id, updatedCard, true); // add true to fix state problems
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setIsLoading(true);
    try {
      const updatedCard = await deleteCardComment(card._id, commentId);
      onUpdateCard(card._id, updatedCard); // Update local state with the returned card
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };


  //MODAL RENDERING
  const renderDetailModal = () => {
    if (!showDetailModal) return null;
  
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return 'just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    };
    
    return createPortal(
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        style={{ zIndex: 1000 }}
      >
        <div 
          ref={detailModalRef}
          className="w-11/12 max-w-2xl h-[80vh] rounded-lg shadow-xl flex flex-col"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            transition: 'background-color 0.2s, color 0.2s'
          }}
        >
          {/* Header Section */}
          <div className="p-6 border-b" style={{ borderColor: colors.background.tertiary }}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{card.name}</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={{ color: colors.text.secondary }}
                className="hover:opacity-80"
              >
                <IoMdClose size={24} />
              </button>
            </div>
          </div>
  
          {/* Scrollable Content Section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <div className="flex flex-col">
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  className="w-full p-2 rounded mb-2"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    color: colors.text.primary,
                    transition: 'background-color 0.2s, color 0.2s'
                  }}
                  rows={4}
                  placeholder="Add a description..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleDescriptionSave}
                  className={`flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                    isLoading || !isDescriptionChanged ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading || !isDescriptionChanged}
                >
                  <MdSave className="mr-2" />
                  Save Description
                </button>
              </div>
            </div>
  
            {/* Comments Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Comments</h3>
              <div className="space-y-4 mb-4">
                {card.comments && card.comments.map((comment) => (
                  <div 
                    key={comment._id} 
                    className="p-4 rounded"
                    style={{
                      backgroundColor: colors.background.tertiary,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div className="flex flex-col">
                      {/* Comment Header with User Info */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {comment.userId?.name || 'Anonymous'}
                          </span>
                          <span className="mx-2 text-sm" style={{ color: colors.text.secondary }}>
                            •
                          </span>
                          <span className="text-sm" style={{ color: colors.text.secondary }}>
                            {formatTimestamp(comment.createdAt)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className={`text-red-500 hover:text-red-700 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isLoading}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                      {/* Comment Content */}
                      <p className="whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Add Comment Section - Made sticky */}
              <div 
                className="sticky bottom-0 bg-opacity-90 backdrop-blur-sm py-4"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 rounded mb-2"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    color: colors.text.primary,
                    transition: 'background-color 0.2s, color 0.2s'
                  }}
                  rows={2}
                  placeholder="Write a comment..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleAddComment}
                  className="w-full px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: accent.primary,
                    color: '#ffffff',
                    transition: 'background-color 0.2s'
                  }}
                  disabled={isLoading}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById('modal-root')
    );
  };

  const renderOptionsMenu = () => {
    if (!showOptions) return null;

    return createPortal(
      <div
        ref={optionsRef}
        style={{
          position: 'fixed',
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
          backgroundColor: colors.background.secondary,
          color: colors.text.primary,
          transition: 'background-color 0.2s, color 0.2s',
          zIndex: 1100,
        }}          
        className="w-36 shadow-lg rounded border p-1"
      >
        <button
          id="delete-button"
          onClick={handleDeleteClick}
          className="w-full text-left px-2 py-1 rounded hover:opacity-80"
          style={{ color: accent.danger }}
        >
          Delete Card
        </button>
        <button 
          onClick={() => setShowOptions(false)} 
          className="w-full text-left px-2 py-1 rounded hover:opacity-80"
          style={{ color: colors.text.primary }}
        >
          Close
        </button>
      </div>,
      document.getElementById('modal-root')
    );
  };

  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return createPortal(
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        style={{ zIndex: 1000 }}
      >
        <div 
          ref={deleteModalRef} 
          className="p-6 rounded shadow-lg"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            transition: 'background-color 0.2s, color 0.2s'
          }}
        >
          <p className="text-lg mb-4">Are you sure you want to delete this card?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded hover:opacity-90"
              style={{
                backgroundColor: accent.danger,
                color: '#ffffff',
                transition: 'background-color 0.2s'
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded hover:opacity-90"
              style={{
                backgroundColor: accent.primary,
                color: '#ffffff',
                transition: 'background-color 0.2s'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>,
      document.getElementById('modal-root')
    );
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
          className="p-2 rounded mb-2 shadow group transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: colors.background.tertiary,
            color: colors.text.primary,
            border: '1px solid transparent',
            borderColor: snapshot.isDragging ? colors.text.secondary : 'transparent',
            transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
            position: 'relative',
            zIndex: snapshot.isDragging ? 90 : 20,
            ...provided.draggableProps.style
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
                  className="w-full resize-none p-0 z-10 border-none focus:outline-none rounded"
                  style={{
                    backgroundColor: colors.background.secondary,
                    color: colors.text.primary,
                    minHeight: textareaHeight,
                    transition: 'background-color 0.2s, color 0.2s',
                    
                  }}
                />
              ) : (
                <div ref={contentRef} className='' onClick={handleCardClick}>
                  <span className="block">{card.name}</span>
                  <MdOutlineModeEdit
                    onClick={handleEditClick}
                    className="absolute top-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 hover:text-white cursor-pointer transition-opacity duration-300 hover:opacity-80"
                  style={{
                    color: colors.text.secondary,
                    backgroundColor: colors.background.secondary,
                    borderRadius: '.375rem',
                    
                  }}
                  size={25}
                  />
                </div>
              )}
           
          </div>

          {renderDetailModal()}
          {renderOptionsMenu()}
          {renderDeleteModal()}

        </div>
      )}
    </Draggable>
  );
}

export default Card;

