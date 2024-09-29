import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false); 
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editBoardName, setEditBoardName] = useState('');
  const [editBoardId, setEditBoardId] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('#ffffff');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBoardId, setDeleteBoardId] = useState('');
  const navigate = useNavigate();


  const createBoardRef = useRef(null);
  const editBoardRef = useRef(null);
  const deleteBoardRef = useRef(null);

  const createInputRef = useRef(null);
  const editInputRef = useRef(null);

  const settingsRef = useRef(null);
  const pageSettingsModalRef = useRef(null);

  const [backgroundImage, setBackgroundImage] = useState(() => {
    const savedBackground = localStorage.getItem('backgroundImage');
    return savedBackground === 'null' ? null : (savedBackground || "url('/bsas5.webp')");
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });


  // List of background image URLs to choose from
  const backgroundImages = [
    { url: "url('/bsas5.webp')" , label: 'street' },
    { url: "url('/bsas7.webp')" , label: 'park' },
    { url: "url('/bsas1.webp')" , label: 'city' },
    { url: "url('/bsas4.webp')" , label: 'train' },
   
  ];

  useEffect(() => {
    localStorage.setItem('backgroundImage', backgroundImage);
  }, [backgroundImage]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handlePageSettings = () => {
    setIsDropdownOpen(false);
    setIsPageSettingsModalOpen(true);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleBackgroundImageSelect = (url) => {
    setBackgroundImage(url);
  };

  const handleRemoveBackgroundImage = () => {
    setBackgroundImage(null);
  };

  const getThemeStyles = (isDark) => ({
    backgroundColor: isDark ? '#333' : '#f7fafc',
    color: isDark ? '#fff' : '#000',
  });

  const getModalStyles = (isDark) => ({
    backgroundColor: isDark ? '#4a5568' : '#fff',
    color: isDark ? '#fff' : '#000',
  });

  const getBoardStyles = (isDark) => ({
    backgroundColor: isDark ? '#1a202c' : '#bfd7e7',
    color: isDark ? '#e2e8f0' : '#2d3748',
  });

  const getButtonStyles = (isDark, colorScheme) => {
    const baseStyles = "mt-2 px-3 py-1 rounded transition duration-200 ease-in-out";
    const colorStyles = {
      blue: isDark ? "text-blue-300 hover:bg-blue-800" : "text-blue-600 hover:bg-blue-100",
      green: isDark ? "text-green-300 hover:bg-green-800" : "text-green-600 hover:bg-green-100",
      red: isDark ? "text-red-300 hover:bg-red-800" : "text-red-600 hover:bg-red-100",
    };
    return `${baseStyles} ${colorStyles[colorScheme]}`;
  };

  const getNavBarStyles = (isDark) => ({
    backgroundColor: isDark ? '#1a202c' : '#e4eef5',
    color: isDark ? '#fff' : '#000',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  });


  const handleClickOutside = (event) => {
    if (isCreateModalOpen && createBoardRef.current && !createBoardRef.current.contains(event.target)) {
      setIsCreateModalOpen(false);
    }
    if (isEditModalOpen && editBoardRef.current && !editBoardRef.current.contains(event.target)) {
      setIsEditModalOpen(false);
    }
    if (isDeleteModalOpen && deleteBoardRef.current && !deleteBoardRef.current.contains(event.target)) {
      setIsDeleteModalOpen(false);
    }
    if (isDropdownOpen && settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (isPageSettingsModalOpen && pageSettingsModalRef.current && !pageSettingsModalRef.current.contains(event.target)) {
      setIsPageSettingsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateModalOpen, isEditModalOpen, isDeleteModalOpen, isDropdownOpen, isPageSettingsModalOpen]);


  // Automatically focus on the Create Board input when modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      createInputRef.current.focus();
    }
  }, [isCreateModalOpen]);

  // Automatically focus on the Edit Board input when modal opens
  useEffect(() => {
    if (isEditModalOpen) {
      editInputRef.current.focus();
    }
  }, [isEditModalOpen]);





  //get data from the DB
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 401) {
          handleLogout(); // Token expired or invalid
        } else {  
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            setError(data.message);
          }
        }
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    const fetchBoardsData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 401) {
          handleLogout(); // Token expired or invalid
        } else {
          const data = await response.json();
          if (response.ok) {
            setBoards(data);
          } else {
            setError(data.message);
          }
        }
      } catch (err) {
        setError('Failed to fetch boards');
      }
    };

    fetchUserData();
    fetchBoardsData();
  }, []);

  //board CRUD

  const handleCreateBoard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newBoardName,
          description: '',
          isPrivate: true,
          backgroundColor: newBoardColor,
        }),
      });
      if (response.ok) {
        const newBoard = await response.json();
        setBoards([...boards, newBoard]);
        setIsCreateModalOpen(false);
        setNewBoardName('');
        setNewBoardColor('#ffffff');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create a new board');
    }
  };

  const handleEditBoard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards/${editBoardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: editBoardName,
        }),
      });
      if (response.ok) {
        const updatedBoard = await response.json();
        setBoards(boards.map(board => (board._id === editBoardId ? updatedBoard : board)));
        setIsEditModalOpen(false);
        setEditBoardName('');
        setEditBoardId('');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to edit the board');
    }
  };

  const handleOpenDeleteModal = (boardId) => {
    setDeleteBoardId(boardId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteBoard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards/${deleteBoardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setBoards(boards.filter(board => board._id !== deleteBoardId));
        setIsDeleteModalOpen(false);
        setDeleteBoardId('');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete the board');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  ///////////////////////////////////////
  ///BEGIN JSX////////////////////////////
  ////////////////////////////////////////
  return (
    <div className="min-h-screen flex flex-col">
      <nav 
        className="p-2 fixed top-0 left-0 right-0 z-10"
        style={getNavBarStyles(theme === 'dark')}
      >
        <div className="container mx-auto flex justify-between items-center">
          {user && (
            <h1 className="text-2xl font-semibold">Welcome, {user.name}!</h1>
          )}
          <div className="flex items-center space-x-4">
            <button
              className={`px-4 py-2 text-sm rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create New Board
            </button>
            <div 
              className="relative inline-block text-left"
              ref={settingsRef}
            >
              <button
                className={`px-4 py-2 text-sm rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Settings
              </button>
              {isDropdownOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={handlePageSettings}
                    >
                      Page Settings
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div 
        className={`flex-grow pt-20 ${
          backgroundImage ? "bg-cover bg-center bg-no-repeat bg-fixed" : ""
        } p-6 overflow-auto`}
        style={{
          ...(backgroundImage ? { backgroundImage } : getThemeStyles(theme === 'dark')),
        }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:mx-12 lg:mx-24 xl:mx-48 mt-24">
              {boards.map((board) => (
                <div
                  key={board._id}
                  className=" p-4 rounded shadow max-w-[264px]"
                  // style={{ backgroundColor: board.backgroundColor }}
                  style={getBoardStyles(theme === 'dark')}
                >
                  <h2 className="text-xl font-bold">{board.name}</h2>
                  <button
                    className={getButtonStyles(theme === 'dark', 'blue')}
                    onClick={() => navigate(`/boards/${board._id}`)}
                  >
                    View Board
                  </button>
                  <button
                    className={getButtonStyles(theme === 'dark', 'green')}
                    onClick={() => {
                      setEditBoardName(board.name);
                      setEditBoardId(board._id);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={getButtonStyles(theme === 'dark', 'red')}
                    onClick={() => handleOpenDeleteModal(board._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Modal for Page Settings */}
        {isPageSettingsModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div
                  className="p-6 rounded shadow-lg"
                  style={getModalStyles(theme === 'dark')}
                  ref={pageSettingsModalRef}
                >
                  <h2 className="text-xl font-bold mb-4">Page Settings</h2>
                  <p className="mb-4">Customize your dashboard:</p>

                  {/* Theme Options */}
                  <div className="flex flex-col space-y-2 mb-4">
                    <p>Theme:</p>
                    <button
                      className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                      onClick={() => handleThemeChange('light')}
                    >
                      Light Mode
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      Dark Mode
                    </button>
                  </div>

                  {/* Background Image Options */}
                  <div className="mb-4">
                    <p>Background Image:</p>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {backgroundImages.map((image) => (
                        <button
                          key={image.url}
                          className={`border-2 rounded ${backgroundImage === image.url ? 'border-blue-500' : 'border-transparent'}`}
                          onClick={() => handleBackgroundImageSelect(image.url)}
                        >
                          <div className="w-full h-20 bg-cover bg-center" style={{backgroundImage: image.url}}></div>
                          <p className="text-center mt-1">{image.label}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      className={`w-full mt-2 px-4 py-2 rounded ${
                        backgroundImage === null ? 'bg-blue-500 text-white' : (theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black')
                      }`}
                      onClick={handleRemoveBackgroundImage}
                    >
                      No Background Image
                    </button>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsPageSettingsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

        {/* {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
            <div className="bg-gray-700 text-gray-300 p-6 rounded shadow" ref={createBoardRef}>
              <h2 className="text-xl font-bold mb-4">Create New Board</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Board Name</label>
                <input
                  ref={createInputRef}
                  type="text"
                  className="border p-2 w-full bg-gray-600 text-gray-300"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateBoard();
                    }
                  }}
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCreateBoard}
              >
                Create
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )} */}

        {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="p-6 rounded shadow" ref={createBoardRef} style={getModalStyles(theme === 'dark')}>
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
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={handleCreateBoard}
                    >
                      Create
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${
                        theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'
                      }`}
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
          {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 rounded shadow" ref={editBoardRef} style={getModalStyles(theme === 'dark')}>
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
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 rounded shadow" ref={deleteBoardRef} style={getModalStyles(theme === 'dark')}>
              <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
              <p className="mb-4">Do you really want to delete this board?</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleConfirmDeleteBoard}
              >
                Yes, Delete
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'
                }`}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-700 text-gray-300 p-6 rounded shadow" ref={editBoardRef}>
              <h2 className="text-xl font-bold mb-4">Edit Board</h2>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">New Board Name</label>
                <input
                  ref={editInputRef}
                  type="text"
                  className="border p-2 w-full bg-gray-600 text-gray-300 rounded"
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
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-700 text-gray-300 p-6 rounded shadow" ref={deleteBoardRef}>
              <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
              <p className="mb-4">Do you really want to delete this board?</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleConfirmDeleteBoard}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </div>


    </div>
    
  );
};

export default DashboardPage;





