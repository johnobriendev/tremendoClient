import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';


const EditBoardModal = ({ 
  isOpen, 
  onClose, 
  editBoardName, 
  setEditBoardName, 
  handleEditBoard,
}) => {
  const { colors, accent } = useTheme();
  const editInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      editInputRef.current?.focus();
    }
  }, [isOpen]);

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
        className="relative p-6 rounded-lg shadow-xl min-w-[400px]"
        ref={modalRef}
        style={{
          backgroundColor: colors.background.secondary,
          color: colors.text.primary
        }}
      >
        <h2 className="text-xl font-bold mb-4">Edit Board</h2>
        <div className="mb-4">
          <label className="block mb-2">New Board Name</label>
          <input
            ref={editInputRef}
            type="text"
            className="w-full p-2 rounded"
            style={{
              backgroundColor: colors.background.tertiary,
              color: colors.text.primary,
              border: `1px solid ${colors.text.muted}`
            }}
            value={editBoardName}
            onChange={(e) => setEditBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditBoard();
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: accent.danger,
              color: '#ffffff'
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: accent.success,
              color: '#ffffff'
            }}
            onClick={handleEditBoard}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;