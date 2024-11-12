import React, { useRef, useEffect } from 'react';

const EditBoardModal = ({ 
  isOpen, 
  onClose, 
  theme, 
  editBoardName, 
  setEditBoardName, 
  handleEditBoard,
  getModalStyles 
}) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded shadow" ref={modalRef} style={getModalStyles(theme === 'dark')}>
        <h2 className="text-xl font-bold mb-4">Edit Board</h2>
        <div className="mb-4">
          <label className="block mb-2">New Board Name</label>
          <input
            ref={editInputRef}
            type="text"
            className={`border p-2 w-full rounded ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
            }`}
            value={editBoardName}
            onChange={(e) => setEditBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditBoard();
              }
            }}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleEditBoard}
        >
          Save Changes
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

export default EditBoardModal;