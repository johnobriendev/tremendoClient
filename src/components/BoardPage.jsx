import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        // Fetch board data
        const boardResponse = await fetch(`${apiBaseUrl}/boards/${boardId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!boardResponse.ok) {
          throw new Error(`Error fetching board: ${boardResponse.statusText}`);
        }
        const boardData = await boardResponse.json();
        setBoard(boardData);

        // Fetch lists data
        const listsResponse = await fetch(`${apiBaseUrl}/lists/${boardId}/lists`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!listsResponse.ok) {
          throw new Error(`Error fetching lists: ${listsResponse.statusText}`);
        }
        const listsData = await listsResponse.json();
        setLists(listsData);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    fetchBoardData();
  }, [boardId]);

  return (
    <div>
      {board && <h1>{board.name}</h1>}
      {lists.map((list) => (
        <div key={list._id} style={{ order: list.position }}>
          <h2>{list.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default BoardPage;