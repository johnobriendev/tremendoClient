import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [editListName, setEditListName] = useState({});

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

        // Fetch cards data
        const cardsResponse = await fetch(`${apiBaseUrl}/cards/${boardId}/cards`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!cardsResponse.ok) {
          throw new Error(`Error fetching cards: ${cardsResponse.statusText}`);
        }
        const cardsData = await cardsResponse.json();
        setCards(cardsData);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    fetchBoardData();
  }, [boardId]);

  const handleCreateList = async () => {
    if (newListName.trim() === '') return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/lists/${boardId}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newListName,
          position: lists.length + 1, // Set position to the end
        }),
      });
      if (!response.ok) {
        throw new Error(`Error creating list: ${response.statusText}`);
      }
      const newList = await response.json();
      setLists([...lists, newList]);
      setNewListName('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleCreateCard = async (listId) => {
    const cardName = newCardName[listId]?.trim(); // Get the card name and trim spaces
    if (!cardName) return; // Exit if card name is empty
  
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/cards/${boardId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          listId,
          name: cardName,
          position: cards.filter(card => card.listId === listId).length + 1, // Position at the end of the list
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error creating card: ${response.statusText}`);
      }
  
      const newCard = await response.json();
      setCards([...cards, newCard]); // Add the new card to the state
      setNewCardName({ ...newCardName, [listId]: '' }); // Clear the input field for the current list
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };
  

 
 
  const handleListNameChange = async (listId, newName) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/lists/lists/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        throw new Error(`Error updating list: ${response.statusText}`);
      }
      const updatedList = await response.json();
      setLists(lists.map(list => list._id === listId ? updatedList : list));
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/lists/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error deleting list: ${response.statusText}`);
      }
      setLists(lists.filter(list => list._id !== listId));
      setCards(cards.filter(card => card.listId !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };
  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {lists.map((list) => (
        <div key={list._id} className="flex-shrink-0 w-64 bg-gray-100 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              value={editListName[list._id] || list.name}
              onChange={(e) => setEditListName({ ...editListName, [list._id]: e.target.value })}
              onBlur={() => handleListNameChange(list._id, editListName[list._id] || list.name)}
              className="text-lg font-semibold border p-1 rounded"
            />
            <button
              onClick={() => handleDeleteList(list._id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              Delete
            </button>
          </div>
          <div>
            {cards.filter(card => card.listId === list._id).map(card => (
              <div key={card._id} className="bg-white p-2 mb-2 rounded shadow-sm">
                <h3 className="font-semibold">{card.name}</h3>
                <p>{card.description}</p>
              </div>
            ))}
            <input
              type="text"
              value={newCardName[list._id] || ''}
              onChange={(e) => setNewCardName({ ...newCardName, [list._id]: e.target.value })}
              placeholder="New card name"
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              onClick={() => handleCreateCard(list._id)}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Add Card
            </button>
          </div>
        </div>
      ))}
      <div className="flex-shrink-0 w-64 bg-gray-100 p-4 rounded-md shadow-md">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleCreateList}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Add List
        </button>
      </div>
    </div>
  );
  // return (
  //   <div className="flex overflow-x-auto">
  //     {lists.map((list) => (
  //       <div key={list._id} className="flex-shrink-0 w-64 bg-gray-100 m-2 p-4 rounded-md shadow-md">
  //         <div className="flex justify-between items-center">
  //           <input
  //             type="text"
  //             value={list.name}
  //             onChange={(e) => handleListNameChange(list._id, e.target.value)}
  //             className="text-lg font-semibold"
  //           />
  //           <button onClick={() => handleDeleteList(list._id)}>Delete</button>
  //         </div>
  //         <div className="mt-2">
  //           {list.cards && list.cards.map(card => (
  //             <div key={card._id} className="bg-white p-2 mb-2 rounded shadow-sm">
  //               <h3 className="font-semibold">{card.name}</h3>
  //               <p>{card.description}</p>
  //             </div>
  //           ))}
  //           <input
  //             type="text"
  //             value={newCardName}
  //             onChange={(e) => setNewCardName(e.target.value)}
  //             placeholder="New card name"
  //             className="border p-2 rounded"
  //           />
  //           <button onClick={() => handleCreateCard(list._id)} className="bg-blue-500 text-white p-2 rounded">Add Card</button>
  //         </div>
  //       </div>
  //     ))}
  //     <div className="flex-shrink-0 w-64 bg-gray-100 m-2 p-4 rounded-md shadow-md">
  //       <input
  //         type="text"
  //         value={newListName}
  //         onChange={(e) => setNewListName(e.target.value)}
  //         placeholder="New list name"
  //         className="border p-2 rounded w-full"
  //       />
  //       <button onClick={handleCreateList} className="bg-blue-500 text-white p-2 rounded mt-2">Add List</button>
  //     </div>
  //   </div>
  // );
}

export default BoardPage;





// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function BoardPage() {
//   const { boardId } = useParams();
//   const [board, setBoard] = useState(null);
//   const [lists, setLists] = useState([]);

//   useEffect(() => {
//     const fetchBoardData = async () => {
//       try {

//         const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

//         // Fetch board data
//         const boardResponse = await fetch(`${apiBaseUrl}/boards/${boardId}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (!boardResponse.ok) {
//           throw new Error(`Error fetching board: ${boardResponse.statusText}`);
//         }
//         const boardData = await boardResponse.json();
//         setBoard(boardData);

//         // Fetch lists data
//         const listsResponse = await fetch(`${apiBaseUrl}/lists/${boardId}/lists`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (!listsResponse.ok) {
//           throw new Error(`Error fetching lists: ${listsResponse.statusText}`);
//         }
//         const listsData = await listsResponse.json();
//         setLists(listsData);
//       } catch (error) {
//         console.error('Error fetching board data:', error);
//       }
//     };

//     fetchBoardData();
//   }, [boardId]);

//   return (
//     <div>
//       {board && <h1>{board.name}</h1>}
//       {lists.map((list) => (
//         <div key={list._id} style={{ order: list.position }}>
//           <h2>{list.name}</h2>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default BoardPage;