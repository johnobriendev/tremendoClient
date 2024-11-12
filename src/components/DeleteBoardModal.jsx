// DeleteBoardModal.jsx
import React, { useRef, useEffect } from 'react';

const DeleteBoardModal = ({ 
  isOpen, 
  onClose, 
  theme, 
  handleConfirmDelete,
  getModalStyles 
}) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded shadow" ref={modalRef} style={getModalStyles(theme === 'dark')}>
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">Do you really want to delete this board?</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleConfirmDelete}
        >
          Yes, Delete
        </button>
        <button
          className={`px-4 py-2 rounded ${
            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteBoardModal;