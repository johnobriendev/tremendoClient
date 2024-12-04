import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { backgroundImages } from '../constants/backgroundImages';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import List from './List'; // Import List component
import Navbar from './Navbar';
import PageSettingsModal from './PageSettingsModal';
import { useTheme } from '../hooks/useTheme';
import { useBackground } from '../hooks/useBackground';
import { getThemeStyles, getModalStyles, getNavBarStyles } from '../utils/boardStyles';
import * as api from '../utils/api';

function BoardPage() {
  const [theme, setTheme] = useTheme();
  const [backgroundImage, setBackgroundImage] = useBackground();

  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [editListName, setEditListName] = useState({});
  const navigate = useNavigate();

  //list input stuff
  const [isAddingList, setIsAddingList] = useState(false);
  const newListInputRef = useRef(null);
  const newListButtonRef = useRef(null);

  // New state variables for page settings
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false);


  // New refs for handling click outside
  const settingsRef = useRef(null);
  const pageSettingsModalRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await api.fetchUserData(token);
        setUser(userData);
        //await fetchBoardData()
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


  const fetchBoardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const boardData = await api.fetchBoardData(token, boardId);
      setBoard(boardData);
      const listsData = await api.fetchLists(token, boardId);
      setLists(listsData);
      const cardsData = await api.fetchCards(token, boardId);
      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

   //closes the new list input, drop down menu, or page setting modal when the user clicks outside of them
   const handleClickOutside = (event) => {
    if (newListInputRef.current && !newListInputRef.current.contains(event.target) && !newListButtonRef.current.contains(event.target)) {
      setIsAddingList(false);
      setNewListName('');
    }
  };


  //adds the click event to the document when the drop down menu or page settings modal is opened
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isPageSettingsModalOpen]);


  //allows the user to use the enter key to add a new list
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCreateList();
    }
  };

  const handleCreateList = async () => {
    if (newListName.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const newList = await api.createList(token, boardId, {
        name: newListName,
        position: lists.length + 1,
      });
      setLists([...lists, newList]);
      setNewListName('');
      setIsAddingList(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleListNameChange = async (listId, newName) => {
    try {
      const token = localStorage.getItem('token');
      const updatedList = await api.updateList(token, listId, { name: newName });
      setLists(lists.map(list => list._id === listId ? updatedList : list));
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const token = localStorage.getItem('token');
      await api.deleteList(token, listId);
      setLists(lists.filter(list => list._id !== listId));
      setCards(cards.filter(card => card.listId !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleCreateCard = async (listId) => {
    const cardName = newCardName[listId]?.trim();
    if (!cardName) return;
  
    try {
      const token = localStorage.getItem('token');
      const newCard = await api.createCard(token, boardId, {
        listId,
        name: cardName,
        position: cards.filter(card => card.listId === listId).length + 1,
      });
      setCards([...cards, newCard]);
      setNewCardName({ ...newCardName, [listId]: '' });
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleUpdateCard = async (cardId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const updatedCard = await api.updateCard(token, cardId, updates);
      setCards(cards.map(card => card._id === cardId ? updatedCard : card));
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const token = localStorage.getItem('token');
      await api.deleteCard(token, cardId);
      setCards(cards.filter(card => card._id !== cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    if (type === 'CARD') {
      const startListId = source.droppableId;
      const endListId = destination.droppableId;
      
      const sourceListCards = cards
        .filter(card => card.listId === startListId)
        .sort((a, b) => a.position - b.position);
      
      const destinationListCards = startListId === endListId 
        ? sourceListCards 
        : cards
            .filter(card => card.listId === endListId)
            .sort((a, b) => a.position - b.position);
  
      const draggedCard = cards.find(card => card._id === draggableId);
      const updatedCards = [];
  
      if (startListId === endListId) {
        const newCards = sourceListCards.filter(card => card._id !== draggableId);
        newCards.splice(destination.index, 0, draggedCard);
        
        newCards.forEach((card, index) => {
          updatedCards.push({
            _id: card._id,
            position: index + 1,
            listId: startListId
          });
        });
      } else {
        const newSourceCards = sourceListCards.filter(card => card._id !== draggableId);
        newSourceCards.forEach((card, index) => {
          updatedCards.push({
            _id: card._id,
            position: index + 1,
            listId: startListId
          });
        });
  
        const newDestCards = [...destinationListCards];
        newDestCards.splice(destination.index, 0, draggedCard);
        newDestCards.forEach((card, index) => {
          updatedCards.push({
            _id: card._id,
            position: index + 1,
            listId: endListId
          });
        });
      }
  
      setCards(cards.map(card => {
        const updatedCard = updatedCards.find(uc => uc._id === card._id);
        return updatedCard ? { ...card, ...updatedCard } : card;
      }));
  
      try {
        const token = localStorage.getItem('token');
        await Promise.all(updatedCards.map(card => 
          fetch(`${import.meta.env.VITE_API_BASE_URL}/cards/${card._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              position: card.position,
              listId: card.listId
            }),
          })
        ));
      } catch (error) {
        console.error('Error updating positions:', error);
        fetchBoardData();
      }
    }
  };

  
 
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <div 
      className={`min-h-screen flex flex-col ${
        backgroundImage ? "bg-cover bg-center bg-no-repeat bg-fixed" : ""
      }`}
      style={{
        ...(backgroundImage ? { backgroundImage } : getThemeStyles(theme === 'dark')),
      }}
    >
      <Navbar 
        user={user}
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
        boardName={board?.name}
        showCreateBoard={false}
      />
       
      <div className='pt-24 sm:pt-16 overflow-x-auto'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='flex-grow  w-full'>
            <Droppable droppableId="all-lists" direction="horizontal">
              {(provided) => (
                <div
                  className="flex items-start px-6 space-x-4 "
                  style={{
                    paddingRight: '1.5rem',
                    minWidth: 'max-content',
                    minHeight: 'calc(100vh - 80px)' //can be adjusted if more space is needed
                  }}
                  {...provided.droppableProps}
                  ref={provided.innerRef} 
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
                      handleUpdateCard={handleUpdateCard} 
                      handleDeleteCard={handleDeleteCard} 
                      index={index}
                      theme={theme}
                    />
                  ))}
                  {provided.placeholder}
                  <div className="w-[264px] shrink-0 mr-6">
                    {!isAddingList ? (
                      <button
                        onClick={() => setIsAddingList(true)}
                        className={`w-full py-2 px-4 rounded shadow-xl ${
                          theme === 'dark' ? 'bg-[#2B2F3A] hover:bg-opacity-70 text-[#CBD5E0]'  :  'bg-[#c4d5e5] hover:bg-opacity-70'
                        }`}
                        // style={getAddListStyles(theme === 'dark')}
                      >
                      + Add another list 
                      </button>
                    ) : (
                      <div  className={`${
                        theme === 'dark' ? 'bg-[#2B2F3A]' :  'bg-[#c4d5e5]'
                      }  p-2 rounded`}>
                        <input
                          type="text"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter list title..."
                          className={`${
                            theme === 'dark' ? 'bg-gray-700 text-white' :  'bg-[#EDF2F7] placeholder:text-black text-black'
                          }  w-full p-2 rounded mb-2`}
                          ref={newListInputRef}
                        />
                        <div className="flex justify-between">
                          <button
                            onClick={handleCreateList}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            ref={newListButtonRef}
                          >
                            Add List
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingList(false);
                              setNewListName('');
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
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
      
    </div>
  );
}
export default BoardPage;




   // //this function is called when a card is dragged into another position. It needs to be fixed to update the positions of the other affected cards as well
  // const handleDragEnd = async (result) => {
  //   const { destination, source, draggableId, type } = result;
  
  //   // If there's no destination, the card was dropped outside a valid droppable area
  //   if (!destination) return;
  
  //   // If the card was dropped back into its original position, do nothing
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return;
  //   }
  
  //   // If we're dealing with a card drag
  //   if (type === 'CARD') {
  //     const startListId = source.droppableId;
  //     const endListId = destination.droppableId;
  //     const draggedCardId = draggableId;
  
  //     // Create a new array of cards
  //     let newCards = [...cards];
  
  //     // Find the moved card
  //     const movedCard = newCards.find(card => card._id === draggedCardId);
  
  //     // Remove the card from its original position
  //     newCards = newCards.filter(card => card._id !== draggedCardId);
  
  //     // Update the listId if the card moved to a different list
  //     if (startListId !== endListId) {
  //       movedCard.listId = endListId;
  //     }

  //           // Find the correct insertion index
  //     const destinationCards = newCards.filter(card => card.listId === endListId);
  //     const insertIndex = newCards.findIndex(card => card._id === destinationCards[destination.index]?._id);

  //     // Insert the card at its new position
  //     if (insertIndex !== -1) {
  //       newCards.splice(insertIndex, 0, movedCard);
  //     } else {
  //       newCards.push(movedCard);
  //     }

  //     // Update positions for all cards in the affected list(s)
  //     const affectedListIds = new Set([startListId, endListId]);
  //     newCards = newCards.map(card => {
  //       if (affectedListIds.has(card.listId)) {
  //         const listCards = newCards.filter(c => c.listId === card.listId);
  //         return { ...card, position: listCards.indexOf(card) + 1 };
  //       }
  //       return card;
  //     });

  //     // Log the updated cards for debugging
  //     console.log('Updated cards:', newCards);
  
  //     // Optimistically update the state
  //     setCards(newCards);

  //           // Update the backend
  //     try {
  //       const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  //       const updatedCards = newCards.filter(card => affectedListIds.has(card.listId));

  //       await Promise.all(updatedCards.map(card =>
  //         fetch(`${apiBaseUrl}/cards/${card._id}`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //           body: JSON.stringify({ 
  //             position: card.position,
  //             listId: card.listId
  //           }),
  //         })
  //       ));
  //     } catch (error) {
  //       console.error('Error updating card positions:', error);
  //       fetchBoardData();
  //     }
  //   }
  // };


  //possible dragEnd function that uses the bulk update.
  // const handleDragEnd = async (result) => {
  //   const { destination, source, draggableId, type } = result;
    
  //   if (!destination) return;
  //   if (destination.droppableId === source.droppableId && 
  //       destination.index === source.index) return;
    
  //   if (type === 'CARD') {
  //     const startListId = source.droppableId;
  //     const endListId = destination.droppableId;
      
  //     const sourceListCards = cards
  //       .filter(card => card.listId === startListId)
  //       .sort((a, b) => a.position - b.position);
      
  //     const destinationListCards = startListId === endListId 
  //       ? sourceListCards 
  //       : cards
  //           .filter(card => card.listId === endListId)
  //           .sort((a, b) => a.position - b.position);
  
  //     const draggedCard = cards.find(card => card._id === draggableId);
  //     const updatedCards = [];
  
  //     if (startListId === endListId) {
  //       // Same list movement
  //       const newCards = sourceListCards.filter(card => card._id !== draggableId);
  //       newCards.splice(destination.index, 0, draggedCard);
        
  //       newCards.forEach((card, index) => {
  //         updatedCards.push({
  //           _id: card._id,
  //           position: index + 1,
  //           listId: startListId
  //         });
  //       });
  //     } else {
  //       // Cross-list movement
  //       const newSourceCards = sourceListCards.filter(card => card._id !== draggableId);
  //       newSourceCards.forEach((card, index) => {
  //         updatedCards.push({
  //           _id: card._id,
  //           position: index + 1,
  //           listId: startListId
  //         });
  //       });
  
  //       const newDestCards = [...destinationListCards];
  //       newDestCards.splice(destination.index, 0, draggedCard);
  //       newDestCards.forEach((card, index) => {
  //         updatedCards.push({
  //           _id: card._id,
  //           position: index + 1,
  //           listId: endListId
  //         });
  //       });
  //     }
  
  //     // Optimistic UI update
  //     setCards(cards.map(card => {
  //       const updatedCard = updatedCards.find(uc => uc._id === card._id);
  //       return updatedCard ? { ...card, ...updatedCard } : card;
  //     }));
  
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cards/batch-update`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //         body: JSON.stringify({
  //           cards: updatedCards,
  //           boardId: board._id // Add the board ID for authorization
  //         }),
  //       });
  
  //       if (!response.ok) {
  //         throw new Error('Failed to update cards');
  //       }
  //     } catch (error) {
  //       console.error('Error updating positions:', error);
  //       fetchBoardData(); // Revert to server state if update fails
  //     }
  //   }
  // };
