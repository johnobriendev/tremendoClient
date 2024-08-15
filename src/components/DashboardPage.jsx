import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

    // Fetch boards data
    const fetchBoardsData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: 'New Board',
          lists: ['To-Do', 'Doing', 'Done']
        })
      });
      if (response.ok) {
        const newBoard = await response.json();
        setBoards([...boards, newBoard]);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create a new board');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleCreateBoard}
          >
            Create New Board
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div key={board._id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-bold">{board.title}</h2>
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => navigate(`/boards/${board._id}`)}
                >
                  View Board
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;