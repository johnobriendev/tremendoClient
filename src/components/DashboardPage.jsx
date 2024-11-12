import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { backgroundImages } from '../constants/backgroundImages';
import PageSettingsModal from '../components/PageSettingsModal';
import CreateBoardModal from './CreateBoardModal';
import EditBoardModal from './EditBoardModal';
import DeleteBoardModal from './DeleteBoardModal'
import { useTheme } from '../hooks/useTheme';
import { useBackground } from '../hooks/useBackground';

import { getThemeStyles, getModalStyles, getBoardStyles, getButtonStyles, getNavBarStyles } from '../utils/styles';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
  const [backgroundImage, setBackgroundImage] = useBackground();
  
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false); 
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newBoardName, setNewBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('kanban');
  const [editBoardName, setEditBoardName] = useState('');
  const [editBoardId, setEditBoardId] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('#ffffff');
  const [deleteBoardId, setDeleteBoardId] = useState('');
  
  const settingsRef = useRef(null);


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
          template: selectedTemplate,
        }),
      });
      if (response.ok) {
        const newBoard = await response.json();
        setBoards([...boards, newBoard]);
        setIsCreateModalOpen(false);
        setNewBoardName('');
        setNewBoardColor('#ffffff');
        setSelectedTemplate('kanban');
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
       <Navbar 
        user={user}
        onCreateBoard={() => setIsCreateModalOpen(true)}
        onPageSettings={() => {
          setIsPageSettingsModalOpen(true);
          setIsDropdownOpen(false);
        }}
        onLogout={handleLogout}
        theme={theme}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        getNavBarStyles={getNavBarStyles}
        settingsRef={settingsRef}
      />
   
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

        <PageSettingsModal
          isOpen={isPageSettingsModalOpen}
          onClose={() => setIsPageSettingsModalOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
          backgroundImages={backgroundImages}
          currentBackground={backgroundImage}
          onBackgroundSelect={setBackgroundImage}
          onRemoveBackground={() => setBackgroundImage(null)}
          getModalStyles={getModalStyles}
        />
        <CreateBoardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          theme={theme}
          newBoardName={newBoardName}
          setNewBoardName={setNewBoardName}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          handleCreateBoard={handleCreateBoard}
          getModalStyles={getModalStyles}
        />

        <EditBoardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          theme={theme}
          editBoardName={editBoardName}
          setEditBoardName={setEditBoardName}
          handleEditBoard={handleEditBoard}
          getModalStyles={getModalStyles}
        />

        <DeleteBoardModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          theme={theme}
          handleConfirmDelete={handleConfirmDeleteBoard}
          getModalStyles={getModalStyles}
        />
      </div>
    </div>
  );
};

export default DashboardPage;





