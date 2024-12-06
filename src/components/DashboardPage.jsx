import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BoardList from '../components/BoardList';
import InvitationList from '../components/InvitationList';
import { backgroundImages } from '../constants/backgroundImages';
import PageSettingsModal from '../components/PageSettingsModal';
import CreateBoardModal from './CreateBoardModal';
import EditBoardModal from './EditBoardModal';
import DeleteBoardModal from './DeleteBoardModal';
import InviteUserModal from './InviteUserModal';
import { useTheme } from '../hooks/useTheme';
import { useBackground } from '../hooks/useBackground';
import { getThemeStyles, getModalStyles, getBoardStyles, getButtonStyles, getNavBarStyles } from '../utils/styles';
import * as api from '../utils/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
  const [backgroundImage, setBackgroundImage] = useBackground();
  
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
  //const [inviteBoardId, setInviteBoardId] = useState('');
  
  const settingsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await api.fetchUserData(token);
        setUser(userData);
        const boardsData = await api.fetchAllBoards(token);
        //setBoards(boardsData);
        setOwnedBoards(boardsData.ownedBoards);
        setCollaborativeBoards(boardsData.collaborativeBoards);
        const invitationsData = await api.fetchInvitations(token);
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
      const token = localStorage.getItem('token');
      const newBoard = await api.createBoard(token, {
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
      const token = localStorage.getItem('token');
      const updatedBoard = await api.updateBoard(token, editBoardId, { name: editBoardName });
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
      const token = localStorage.getItem('token');
      await api.deleteBoard(token, deleteBoardId);
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
      const token = localStorage.getItem('token');
      await api.inviteUserToBoard(token, selectedBoardId, email);
      setIsInviteModalOpen(false);
      //setInviteBoardId('');
      setSelectedBoardId(null);
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await api.respondToInvitation(token, invitationId, true);
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
      const boardsData = await api.fetchAllBoards(token);
      setCollaborativeBoards(boardsData.collaborativeBoards);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await api.respondToInvitation(token, invitationId, false);
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
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
        className={`flex-grow pt-28 sm:pt-24 p-6 overflow-auto`}
        style={{
          ...(backgroundImage ? {
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // The key change: using 'scroll' instead of 'fixed'
            backgroundAttachment: 'scroll',
          } : getThemeStyles(theme === 'dark')),
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
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setSelectedBoardId(null);
          }}
          onInviteUser={handleInviteUser}
          theme={theme}
          getModalStyles={getModalStyles}

        />
      </div>
    </div>
  );

  

  

  
};

export default DashboardPage;





// return (
  //   <div className="min-h-screen flex flex-col">
  //      <Navbar 
  //       user={user}
  //       onCreateBoard={() => setIsCreateModalOpen(true)}
  //       onPageSettings={() => {
  //         setIsPageSettingsModalOpen(true);
  //         setIsDropdownOpen(false);
  //       }}
  //       onLogout={handleLogout}
  //       theme={theme}
  //       isDropdownOpen={isDropdownOpen}
  //       setIsDropdownOpen={setIsDropdownOpen}
  //       getNavBarStyles={getNavBarStyles}
  //       settingsRef={settingsRef}
  //     />
   
  //     <div 
  //       className={`flex-grow pt-20 ${
  //         backgroundImage ? "bg-cover bg-center bg-no-repeat bg-fixed" : ""
  //       } p-6 overflow-auto`}
  //       style={{
  //         ...(backgroundImage ? { backgroundImage } : getThemeStyles(theme === 'dark')),
  //       }}
  //     >
  //       {error && <p className="text-red-500">{error}</p>}
  //       {user && (
  //         <>
          
  //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:mx-12 lg:mx-24 xl:mx-48 mt-24">
  //             {boards.map((board) => (
  //               <div
  //                 key={board._id}
  //                 className=" p-4 rounded shadow max-w-[264px]"
  //                 // style={{ backgroundColor: board.backgroundColor }}
  //                 style={getBoardStyles(theme === 'dark')}
  //               >
  //                 <h2 className="text-xl font-bold">{board.name}</h2>
  //                 <button
  //                   className={getButtonStyles(theme === 'dark', 'blue')}
  //                   onClick={() => navigate(`/boards/${board._id}`)}
  //                 >
  //                   View Board
  //                 </button>
  //                 <button
  //                   className={getButtonStyles(theme === 'dark', 'green')}
  //                   onClick={() => {
  //                     setEditBoardName(board.name);
  //                     setEditBoardId(board._id);
  //                     setIsEditModalOpen(true);
  //                   }}
  //                 >
  //                   Edit
  //                 </button>
  //                 <button
  //                   className={getButtonStyles(theme === 'dark', 'red')}
  //                   onClick={() => handleOpenDeleteModal(board._id)}
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </>
  //       )}

  //       <PageSettingsModal
  //         isOpen={isPageSettingsModalOpen}
  //         onClose={() => setIsPageSettingsModalOpen(false)}
  //         theme={theme}
  //         onThemeChange={setTheme}
  //         backgroundImages={backgroundImages}
  //         currentBackground={backgroundImage}
  //         onBackgroundSelect={setBackgroundImage}
  //         onRemoveBackground={() => setBackgroundImage(null)}
  //         getModalStyles={getModalStyles}
  //       />
  //       <CreateBoardModal
  //         isOpen={isCreateModalOpen}
  //         onClose={() => setIsCreateModalOpen(false)}
  //         theme={theme}
  //         newBoardName={newBoardName}
  //         setNewBoardName={setNewBoardName}
  //         selectedTemplate={selectedTemplate}
  //         setSelectedTemplate={setSelectedTemplate}
  //         handleCreateBoard={handleCreateBoard}
  //         getModalStyles={getModalStyles}
  //       />
  //       <EditBoardModal
  //         isOpen={isEditModalOpen}
  //         onClose={() => setIsEditModalOpen(false)}
  //         theme={theme}
  //         editBoardName={editBoardName}
  //         setEditBoardName={setEditBoardName}
  //         handleEditBoard={handleEditBoard}
  //         getModalStyles={getModalStyles}
  //       />
  //       <DeleteBoardModal
  //         isOpen={isDeleteModalOpen}
  //         onClose={() => setIsDeleteModalOpen(false)}
  //         theme={theme}
  //         handleConfirmDelete={handleConfirmDeleteBoard}
  //         getModalStyles={getModalStyles}
  //       />
  //     </div>
  //   </div>
  // );

  //pre wrapper render

  

  // return (
  //   <div className="min-h-screen flex flex-col">
  //     <Navbar 
  //       user={user}
  //       onCreateBoard={() => setIsCreateModalOpen(true)}
  //       onPageSettings={() => {
  //         setIsPageSettingsModalOpen(true);
  //         setIsDropdownOpen(false);
  //       }}
  //       onLogout={handleLogout}
  //       theme={theme}
  //       isDropdownOpen={isDropdownOpen}
  //       setIsDropdownOpen={setIsDropdownOpen}
  //       getNavBarStyles={getNavBarStyles}
  //       settingsRef={settingsRef}
  //     />

  //     <BackgroundWrapper 
  //       backgroundImage={backgroundImage} 
  //       theme={theme}
  //       getThemeStyles={getThemeStyles}
  //     >
  //       <div className="pt-24 sm:pt-20 p-6 overflow-auto">
  //         {error && <p className="text-red-500">{error}</p>}
  //         {user && (
  //           <>
  //             {invitations.length > 0 && (
  //               <div className="mb-8">
  //                 <h2 className="text-2xl font-bold mb-4">Pending Invitations</h2>
  //                 <InvitationList
  //                   invitations={invitations}
  //                   onAccept={handleAcceptInvitation}
  //                   onReject={handleRejectInvitation}
  //                 />
  //               </div>
  //             )}

  //             <h2 className="text-2xl font-bold mb-4">Your Boards</h2>
  //             <BoardList
  //               boards={ownedBoards}
  //               onBoardClick={(id) => navigate(`/boards/${id}`)}
  //               onEditClick={(board) => {
  //                 setEditBoardName(board.name);
  //                 setEditBoardId(board._id);
  //                 setIsEditModalOpen(true);
  //               }}
  //               onDeleteClick={handleOpenDeleteModal}
  //               onInviteClick={handleOpenInviteModal}
  //               isOwned={true}
  //             />
              
  //             <h2 className="text-2xl font-bold mt-8 mb-4">Collaborative Boards</h2>
  //             <BoardList
  //               boards={collaborativeBoards}
  //               onBoardClick={(id) => navigate(`/boards/${id}`)}
  //               isOwned={false}
  //             />
  //           </>
  //         )}
  //       </div>
  //     </BackgroundWrapper>

  //     <PageSettingsModal
  //       isOpen={isPageSettingsModalOpen}
  //       onClose={() => setIsPageSettingsModalOpen(false)}
  //       theme={theme}
  //       onThemeChange={setTheme}
  //       backgroundImages={backgroundImages}
  //       currentBackground={backgroundImage}
  //       onBackgroundSelect={setBackgroundImage}
  //       onRemoveBackground={() => setBackgroundImage(null)}
  //       getModalStyles={getModalStyles}
  //     />
  //     <CreateBoardModal
  //       isOpen={isCreateModalOpen}
  //       onClose={() => setIsCreateModalOpen(false)}
  //       theme={theme}
  //       newBoardName={newBoardName}
  //       setNewBoardName={setNewBoardName}
  //       selectedTemplate={selectedTemplate}
  //       setSelectedTemplate={setSelectedTemplate}
  //       handleCreateBoard={handleCreateBoard}
  //       getModalStyles={getModalStyles}
  //     />
  //     <EditBoardModal
  //       isOpen={isEditModalOpen}
  //       onClose={() => setIsEditModalOpen(false)}
  //       theme={theme}
  //       editBoardName={editBoardName}
  //       setEditBoardName={setEditBoardName}
  //       handleEditBoard={handleEditBoard}
  //       getModalStyles={getModalStyles}
  //     />
  //     <DeleteBoardModal
  //       isOpen={isDeleteModalOpen}
  //       onClose={() => setIsDeleteModalOpen(false)}
  //       theme={theme}
  //       handleConfirmDelete={handleConfirmDeleteBoard}
  //       getModalStyles={getModalStyles}
  //     />
  //     <InviteUserModal
  //       isOpen={isInviteModalOpen}
  //       onClose={() => {
  //         setIsInviteModalOpen(false);
  //         setSelectedBoardId(null);
  //       }}
  //       onInviteUser={handleInviteUser}
  //     />
  //   </div>
  // );