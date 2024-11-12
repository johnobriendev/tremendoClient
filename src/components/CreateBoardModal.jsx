import React, { useRef, useEffect } from 'react';

const CreateBoardModal = ({ 
  isOpen, 
  onClose, 
  theme, 
  newBoardName, 
  setNewBoardName, 
  selectedTemplate, 
  setSelectedTemplate, 
  handleCreateBoard,
  getModalStyles 
}) => {
  const createInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      createInputRef.current?.focus();
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
        <h2 className="text-xl font-bold mb-4">Create New Board</h2>
        <div className="mb-4">
          <label className="block mb-2">Board Name</label>
          <input
            ref={createInputRef}
            type="text"
            className={`border p-2 w-full rounded ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
            }`}
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateBoard();
              }
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Board Template</label>
          <select
            className={`border p-2 w-full rounded ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
            }`}
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="blank">Blank Board</option>
            <option value="kanban">Kanban</option>
            <option value="weekly">Weekly Planner</option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleCreateBoard}
        >
          Create
        </button>
        <button
          className={`px-4 py-2 rounded ${
            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-black'
          }`}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateBoardModal;