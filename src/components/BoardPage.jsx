import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import List from './List'; // Import List component

//{"boardId": ObjectId("66bec4ce5da67329e61e60c6")}


function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [editListName, setEditListName] = useState({});

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



  useEffect(() => {
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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
  
    // If there's no destination, the card was dropped outside a valid droppable area
    if (!destination) return;
  
    // If the card was dropped back into its original position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  
    // If we're dealing with a card drag
    if (type === 'CARD') {
      const startListId = source.droppableId;
      const endListId = destination.droppableId;
      const draggedCardId = draggableId;
  
      // Create a new array of cards
      let newCards = [...cards];
  
      // Find the moved card
      const movedCard = newCards.find(card => card._id === draggedCardId);
  
      // Remove the card from its original position
      newCards = newCards.filter(card => card._id !== draggedCardId);
  
      // Update the listId if the card moved to a different list
      if (startListId !== endListId) {
        movedCard.listId = endListId;
      }
  
      // // Insert the card at its new position
      // newCards.splice(
      //   newCards.findIndex(card => card.listId === endListId) + destination.index,
      //   0,
      //   movedCard
      // );

            // Find the correct insertion index
      const destinationCards = newCards.filter(card => card.listId === endListId);
      const insertIndex = newCards.findIndex(card => card._id === destinationCards[destination.index]?._id);

      // Insert the card at its new position
      if (insertIndex !== -1) {
        newCards.splice(insertIndex, 0, movedCard);
      } else {
        newCards.push(movedCard);
      }

      // Update positions for all cards in the affected list(s)
      const affectedListIds = new Set([startListId, endListId]);
      newCards = newCards.map(card => {
        if (affectedListIds.has(card.listId)) {
          const listCards = newCards.filter(c => c.listId === card.listId);
          return { ...card, position: listCards.indexOf(card) + 1 };
        }
        return card;
      });

      //   // Update positions for all cards in the affected list(s)
      // const affectedListIds = new Set([startListId, endListId]);
      // newCards = newCards.map(card => {
      //   if (affectedListIds.has(card.listId)) {
      //     const listCards = newCards.filter(c => c.listId === card.listId);
      //     const newPosition = listCards.indexOf(card) + 1;
      //     return { ...card, position: newPosition };
      //   }
      //   return card;
      // });

      // Log the updated cards for debugging
      console.log('Updated cards:', newCards);
  
      // Optimistically update the state
      setCards(newCards);

            // Update the backend
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const updatedCards = newCards.filter(card => affectedListIds.has(card.listId));

        await Promise.all(updatedCards.map(card =>
          fetch(`${apiBaseUrl}/cards/cards/${card._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ 
              position: card.position,
              listId: card.listId
            }),
          })
        ));
      } catch (error) {
        console.error('Error updating card positions:', error);
        fetchBoardData();
      }
    }
  };
  
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full overflow-x-auto">
      <Link to='/dashboard' className=' text-sky-500'>Home</Link>
      <h1 className="text-2xl font-bold mt-6 mb-6">{board?.name}</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New List Name"
          className="p-2 border rounded w-full"
        />
        <button
          onClick={handleCreateList}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create List
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 items-start"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ width: '100%' }} 
            >
              {lists.map((list, index) => (
                <List
                  key={list._id}
                  list={list}
                  cards={cards}
                  newCardName={newCardName}
                  editListName={editListName}
                  setEditListName={setEditListName}
                  setNewCardName={setNewCardName}
                  handleCreateCard={handleCreateCard}
                  handleDeleteList={handleDeleteList}
                  handleListNameChange={handleListNameChange}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );




 
}

export default BoardPage;




  