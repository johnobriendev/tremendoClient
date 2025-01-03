// DeleteBoardModal.jsx
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const DeleteBoardModal = ({ 
  isOpen, 
  onClose, 
  handleConfirmDelete,
}) => {
  const { colors, accent } = useTheme();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div 
        className="relative p-6 rounded-lg shadow-xl"
        ref={modalRef}
        style={{
          backgroundColor: colors.background.secondary,
          color: colors.text.primary
        }}
      >
        <h2 className="text-xl font-bold mb-4">Delete Board</h2>
        <p 
          className="mb-6"
          style={{ color: colors.text.secondary }}
        >
          Are you sure you want to delete this board? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: accent.primary,
              color: '#ffffff'
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: accent.danger,
              color: '#ffffff'
            }}
            onClick={handleConfirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoardModal;