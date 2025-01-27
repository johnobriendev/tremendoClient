import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
//import StrictModeDroppable from '../components/StrictModeDroppable';

import List from '../components/List'; 
import Navbar from '../components/Navbar';
import PageSettingsModal from '../components/PageSettingsModal';
import { useTheme } from '../context/ThemeContext.jsx';
import * as api from '../utils/api';

function BoardPage() {
  const { colors, accent, theme } = useTheme();


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
        const userData = await api.fetchUserData();
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
      const boardData = await api.fetchBoardData(boardId);
      setBoard(boardData);
      const listsData = await api.fetchLists(boardId);
      setLists(listsData);
      const cardsData = await api.fetchCards(boardId);
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

  //focuses on the add a list input after pressing add another list
  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);


  useEffect(() => {
    if (newListInputRef.current) {
      newListInputRef.current.style.height = 'auto';
      newListInputRef.current.style.height = `${newListInputRef.current.scrollHeight}px`;
    }
  }, [newListName]);


  //allows the user to use the enter key to add a new list
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCreateList();
    }
  };

  const handleCreateList = async () => {
    if (newListName.trim() === '') return;

    try {
      const newList = await api.createList(boardId, {
        name: newListName,
        position: lists.length + 1,
      });
      setLists([...lists, newList]);
      setNewListName('');
      //setIsAddingList(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleListNameChange = async (listId, newName) => {
    try {
      const updatedList = await api.updateList(listId, { name: newName });
      setLists(lists.map(list => list._id === listId ? updatedList : list));
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await api.deleteList(listId);
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
      const newCard = await api.createCard(boardId, {
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


  const handleUpdateCard = async (cardId, updates, isCommentUpdate = false) => {
    try {
      // If it's a comment update, we already have the updated card
      const updatedCard = isCommentUpdate ? updates : await api.updateCard(cardId, updates);
      
      setCards(prevCards => 
        prevCards.map(card => 
          card._id === cardId 
            ? {
                ...card,
                ...updatedCard,
                // For comment updates, use the populated data directly
                comments: isCommentUpdate ? updatedCard.comments : card.comments
              }
            : card
        )
      );
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };
  

  

  

  const handleDeleteCard = async (cardId) => {
    try {
      await api.deleteCard(cardId);
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

    if (type === 'LIST') {
        // Create a new array of lists
        const newLists = Array.from(lists);
        const [removed] = newLists.splice(source.index, 1);
        newLists.splice(destination.index, 0, removed);
        
        // Calculate new positions for all lists
        const updatedLists = newLists.map((list, index) => ({
            ...list,
            position: index + 1
        }));
        
        // Optimistically update the UI
        setLists(updatedLists);
        
        try {
            // Use your existing api function to update each list's position
            await Promise.all(updatedLists.map(list => 
                api.updateList(list._id, { position: list.position })
            ));
        } catch (error) {
            console.error('Error updating list positions:', error);
            // On error, refresh the board data
            fetchBoardData();
        }
        return;
    }
      
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
        await Promise.all(updatedCards.map(card => 
          api.updateCard(card._id, {
            position: card.position,
            listId: card.listId
          })
        ));
      } catch (error) {
        console.error('Error updating positions:', error);
        fetchBoardData();
      }
    }
  };

  
 
  
  const handleLogout = async () => {
    try {
      await api.logoutUser(); // Wait for the logout process to complete
      navigate('/login'); // Navigate only after logout is done
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should clear local state and redirect
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
        settingsRef={settingsRef}
        boardName={board?.name}
        showCreateBoard={false}
      />
      
      
      <div 
        className="flex-grow pt-24 sm:pt-20 overflow-x-auto relative"
        style={{
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
            transition: 'background-color 0.2s, color 0.2s'
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* <div className="flex-grow w-full"> */}
            <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef} 
                  className="flex items-start px-6 space-x-4"
                  style={{
                    paddingRight: '1.5rem',
                    minWidth: 'max-content',
                    // Adjusted height calculation to work with new padding
                    minHeight: 'calc(100vh - 96px)',
                    position: 'relative', // Added to create stacking context
                    
                  }}
                 
                >
                  {lists
                  .sort((a, b) => a.position - b.position)
                  .map((list, index) => (
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
                      //theme={theme}
                    />
                  ))}
                  {provided.placeholder}
                  
                  {/* Add list button section */}
                  <div className="w-[264px] shrink-0 mr-6">
                    {!isAddingList ? (
                      <button
                        onClick={() => setIsAddingList(true)}
                        className="w-full py-2 px-4 rounded shadow-xl"
                        style={{
                          backgroundColor: colors.background.secondary,
                          color: colors.text.primary,
                          transition: 'background-color 0.2s, color 0.2s'
                        }}
                      >
                        + Add another list 
                      </button>
                    ) : (
                      <div className="p-2 rounded" style={{
                        backgroundColor: colors.background.secondary,
                        transition: 'background-color 0.2s'
                      }}>
                        {/* <input
                          type="text"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter list title..."
                          className="w-full p-2 rounded mb-2"
                          style={{
                            backgroundColor: colors.background.tertiary,
                            color: colors.text.primary,
                            transition: 'background-color 0.2s, color 0.2s'
                          }}
                          ref={newListInputRef}
                        /> */}
                        <textarea
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter list title..."
                          className="w-full p-2 rounded mb-2 resize-none overflow-hidden"
                          style={{
                            backgroundColor: colors.background.tertiary,
                            color: colors.text.primary,
                            transition: 'background-color 0.2s, color 0.2s',
                            minHeight: '2.5rem'
                          }}
                          ref={newListInputRef}
                          rows={1}
                        />
                        <div className="flex justify-between">
                          <button
                            onClick={handleCreateList}
                            className="px-4 py-2 rounded hover:opacity-90"
                            style={{
                              backgroundColor: accent.primary,
                              color: '#ffffff',
                              transition: 'background-color 0.2s'
                            }}
                            ref={newListButtonRef}
                          >
                            Add List
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingList(false);
                              setNewListName('');
                            }}
                            style={{ color: colors.text.secondary }}
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
          {/* </div> */}
        </DragDropContext>
      </div>

      <PageSettingsModal
        isOpen={isPageSettingsModalOpen}
        onClose={() => setIsPageSettingsModalOpen(false)}
        
      />
    </div>
  );
  
  
}
export default BoardPage;



