import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BoardList from '../components/BoardList';
import InvitationList from '../components/InvitationList';
import PageSettingsModal from '../components/PageSettingsModal';
import CreateBoardModal from '../components/CreateBoardModal';
import EditBoardModal from '../components/EditBoardModal';
import DeleteBoardModal from '../components/DeleteBoardModal';
import InviteUserModal from '../components/InviteUserModal';
import { useTheme } from '../context/ThemeContext.jsx';
import * as api from '../utils/api';

const DashboardPage = () => {
  const navigate = useNavigate();

  const { colors } = useTheme();
  
  const [user, setUser] = useState(null);
  const [ownedBoards, setOwnedBoards] = useState([]);
  const [collaborativeBoards, setCollaborativeBoards] = useState([]);
  const [invitations, setInvitations] = useState([]);
  //const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false); 
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

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
        const userData = await api.fetchUserData();
        setUser(userData);
        const boardsData = await api.fetchAllBoards();
        setOwnedBoards(boardsData.ownedBoards);
        setCollaborativeBoards(boardsData.collaborativeBoards);
        const invitationsData = await api.fetchInvitations();
        setInvitations(invitationsData);
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
      const newBoard = await api.createBoard({
        name: newBoardName,
        description: '',
        isPrivate: true,
        backgroundColor: newBoardColor,
        template: selectedTemplate,
      });
      setOwnedBoards([...ownedBoards, newBoard]);
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
      const updatedBoard = await api.updateBoard(editBoardId, { name: editBoardName });
      setOwnedBoards(ownedBoards.map(board => (board._id === editBoardId ? updatedBoard : board)));
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
      await api.deleteBoard(deleteBoardId);
      setOwnedBoards(ownedBoards.filter(board => board._id !== deleteBoardId));
      setIsDeleteModalOpen(false);
      setDeleteBoardId('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenInviteModal = (boardId) => {
    setSelectedBoardId(boardId);
    setIsInviteModalOpen(true);
  };

  const handleInviteUser = async (email) => {
      
      await api.inviteUserToBoard(selectedBoardId, email);
      setIsInviteModalOpen(false);
      setSelectedBoardId(null);
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await api.respondToInvitation(invitationId, true);
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
      const boardsData = await api.fetchAllBoards(token);
      setCollaborativeBoards(boardsData.collaborativeBoards);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      await api.respondToInvitation(invitationId, false);
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    api.logoutUser();
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
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        settingsRef={settingsRef}
      />
   
      <div 
        className={`flex-grow pt-28 sm:pt-24 p-6 overflow-auto`}
        style={{
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
        }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <>
            {invitations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Pending Invitations</h2>
                <InvitationList
                  invitations={invitations}
                  onAccept={handleAcceptInvitation}
                  onReject={handleRejectInvitation}
                />
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Your Boards</h2>
            <BoardList
              
              boards={ownedBoards}
              onBoardClick={(id) => navigate(`/boards/${id}`)}
              onEditClick={(board) => {
                setEditBoardName(board.name);
                setEditBoardId(board._id);
                setIsEditModalOpen(true);
              }}
              onDeleteClick={handleOpenDeleteModal}
              onInviteClick={handleOpenInviteModal}
              isOwned={true}
            />
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Collaborative Boards</h2>
            <BoardList
      
              boards={collaborativeBoards}
              onBoardClick={(id) => navigate(`/boards/${id}`)}
              isOwned={false}
            />
          </>
        )}

        <PageSettingsModal
          
          isOpen={isPageSettingsModalOpen}
          onClose={() => setIsPageSettingsModalOpen(false)}
         
        />
        <CreateBoardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          newBoardName={newBoardName}
          setNewBoardName={setNewBoardName}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          handleCreateBoard={handleCreateBoard}
        />
        <EditBoardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editBoardName={editBoardName}
          setEditBoardName={setEditBoardName}
          handleEditBoard={handleEditBoard}
        />
        <DeleteBoardModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleConfirmDelete={handleConfirmDeleteBoard}
        />
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setSelectedBoardId(null);
          }}
          onInviteUser={handleInviteUser}
        />
      </div>
    </div>
  );
};
export default DashboardPage;




