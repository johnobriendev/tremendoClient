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
import * as api from '../utils/api';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await api.fetchUserData(token);
        setUser(userData);
        const boardsData = await api.fetchBoards(token);
        setBoards(boardsData);
      } catch (err) {
        if (err.message === 'Failed to fetch user data') {
          handleLogout();
        } else {
          setError(err.message);
        }
      }
    };

    fetchData();
  }, []);

  const handleCreateBoard = async () => {
    try {
      const token = localStorage.getItem('token');
      const newBoard = await api.createBoard(token, {
        name: newBoardName,
        description: '',
        isPrivate: true,
        backgroundColor: newBoardColor,
        template: selectedTemplate,
      });
      setBoards([...boards, newBoard]);
      setIsCreateModalOpen(false);
      setNewBoardName('');
      setNewBoardColor('#ffffff');
      setSelectedTemplate('kanban');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBoard = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedBoard = await api.updateBoard(token, editBoardId, { name: editBoardName });
      setBoards(boards.map(board => (board._id === editBoardId ? updatedBoard : board)));
      setIsEditModalOpen(false);
      setEditBoardName('');
      setEditBoardId('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDeleteModal = (boardId) => {
    setDeleteBoardId(boardId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteBoard = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.deleteBoard(token, deleteBoardId);
      setBoards(boards.filter(board => board._id !== deleteBoardId));
      setIsDeleteModalOpen(false);
      setDeleteBoardId('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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





