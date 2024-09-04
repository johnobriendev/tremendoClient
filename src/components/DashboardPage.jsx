import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
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
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateModalOpen, isEditModalOpen, isDeleteModalOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setError(data.message);
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
        const data = await response.json();
        if (response.ok) {
          setBoards(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch boards');
      }
    };

    fetchUserData();
    fetchBoardsData();
  }, []);

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

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Board
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleLogout}
          >
            Log Out
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board._id}
                className="border p-4 rounded shadow"
                style={{ backgroundColor: board.backgroundColor }}
              >
                <h2 className="text-xl font-bold">{board.name}</h2>
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => navigate(`/boards/${board._id}`)}
                >
                  View Board
                </button>
                <button
                  className="text-green-500 mt-2 ml-4"
                  onClick={() => {
                    setEditBoardName(board.name);
                    setEditBoardId(board._id);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 mt-2 ml-4"
                  onClick={() => handleOpenDeleteModal(board._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
          <div className="bg-white p-6 rounded shadow" ref={createBoardRef}>
            <h2 className="text-xl font-bold mb-4">Create New Board</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Board Name</label>
              <input
                type="text"
                className="border p-2 w-full"
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
              <label className="block text-gray-700 mb-2">Background Color</label>
              <input
                type="color"
                className="w-16 h-8"
                value={newBoardColor}
                onChange={(e) => setNewBoardColor(e.target.value)}
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
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow" ref={editBoardRef}>
            <h2 className="text-xl font-bold mb-4">Edit Board</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">New Board Name</label>
              <input
                type="text"
                className="border p-2 w-full"
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
          <div className="bg-white p-6 rounded shadow" ref={deleteBoardRef}>
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
      )}
    </div>
  );
};

export default DashboardPage;





// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const [boards, setBoards] = useState([]);
//   const [error, setError] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newBoardName, setNewBoardName] = useState('');
//   const [newBoardColor, setNewBoardColor] = useState('#ffffff');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user data
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUser(data);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError('Failed to fetch user data');
//       }
//     };

//     // Fetch boards data
//     const fetchBoardsData = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setBoards(data);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError('Failed to fetch boards');
//       }
//     };

//     fetchUserData();
//     fetchBoardsData();
//   }, []);

//   const handleCreateBoard = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           name: newBoardName,
//           description: '',
//           isPrivate: true,
//           backgroundColor: newBoardColor // Example background color
//         }),
//       });
//       if (response.ok) {
//         const newBoard = await response.json();
//         setBoards([...boards, newBoard]);
//         setIsModalOpen(false);
//         setNewBoardName('');
//         setNewBoardColor('#ffffff');
//       } else {
//         const data = await response.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('Failed to create a new board');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {error && <p className="text-red-500">{error}</p>}
//       {user && (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4"
//             onClick={() => setIsModalOpen(true)}
//           >
//             Create New Board
//           </button>
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded mb-4"
//             onClick={handleLogout}
//           >
//             Log Out
//           </button>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {boards.map((board) => (
//               <div
//                 key={board._id}
//                 className="border p-4 rounded shadow"
//                 style={{ backgroundColor: board.backgroundColor }}
//               >
//                 <h2 className="text-xl font-bold">{board.name}</h2>
//                 <button
//                   className="text-blue-500 mt-2"
//                   onClick={() => navigate(`/boards/${board._id}`)}
//                 >
//                   View Board
//                 </button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow">
//             <h2 className="text-xl font-bold mb-4">Create New Board</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Board Name</label>
//               <input
//                 type="text"
//                 className="border p-2 w-full"
//                 value={newBoardName}
//                 onChange={(e) => setNewBoardName(e.target.value)}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Background Color</label>
//               <input
//                 type="color"
//                 className="w-16 h-8"
//                 value={newBoardColor}
//                 onChange={(e) => setNewBoardColor(e.target.value)}
//               />
//             </div>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//               onClick={handleCreateBoard}
//             >
//               Create
//             </button>
//             <button
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;











// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const [boards, setBoards] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user data
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUser(data);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError('Failed to fetch user data');
//       }
//     };

//     // Fetch boards data
//     const fetchBoardsData = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setBoards(data);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError('Failed to fetch boards');
//       }
//     };

//     fetchUserData();
//     fetchBoardsData();
//   }, []);

//   const handleCreateBoard = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           title: 'New Board',
//           lists: ['To-Do', 'Doing', 'Done']
//         })
//       });
//       if (response.ok) {
//         const newBoard = await response.json();
//         setBoards([...boards, newBoard]);
//       } else {
//         const data = await response.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('Failed to create a new board');
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {error && <p className="text-red-500">{error}</p>}
//       {user && (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//             onClick={handleCreateBoard}
//           >
//             Create New Board
//           </button>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {boards.map((board) => (
//               <div key={board._id} className="border p-4 rounded shadow">
//                 <h2 className="text-xl font-bold">{board.title}</h2>
//                 <button
//                   className="text-blue-500 mt-2"
//                   onClick={() => navigate(`/boards/${board._id}`)}
//                 >
//                   View Board
//                 </button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;