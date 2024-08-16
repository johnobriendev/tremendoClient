import React, { useEffect, useState } from 'react';
import Card from './Card';

const List = ({ list, boardId }) => {
  const [cards, setCards] = useState([]);
  const [newCardName, setNewCardName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards/${boardId}/cards`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCards(data.filter(card => card.listId === list._id));
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Failed to fetch cards');
      }
    };

    fetchCards();
  }, [list._id, boardId]);

  const handleCreateCard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards/${boardId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          listId: list._id,
          name: newCardName,
          position: cards.length + 1, // Positioning new card at the end
        }),
      });
      if (response.ok) {
        const newCard = await response.json();
        setCards([...cards, newCard]);
        setNewCardName('');
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (err) {
      console.error('Failed to create a new card');
    }
  };

  const handleUpdateList = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lists/${list._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: listName,
        }),
      });
      if (response.ok) {
        setIsEditing(false);
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (err) {
      console.error('Failed to update list');
    }
  };

  const handleDeleteList = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lists/${list._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        console.log('List deleted successfully');
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (err) {
      console.error('Failed to delete list');
    }
  };

  return (
    <div className="flex-shrink-0 w-64 p-4 border-r">
      {isEditing ? (
        <>
          <input
            type="text"
            className="border p-2 w-full"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={handleUpdateList}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{list.name}</h2>
          <button
            className="text-red-500 mt-2"
            onClick={() => handleDeleteList()}
          >
            Delete List
          </button>
        </>
      )}
      <input
        type="text"
        className="border p-2 w-full mt-4"
        value={newCardName}
        onChange={(e) => setNewCardName(e.target.value)}
        placeholder="New card name"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        onClick={handleCreateCard}
      >
        Add Card
      </button>
      {cards.map((card) => (
        <Card key={card._id} card={card} />
      ))}
    </div>
  );
};

export default List;
