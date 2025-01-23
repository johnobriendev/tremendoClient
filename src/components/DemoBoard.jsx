import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import List from '../components/List';
import DemoBoardNav from '../components/DemoBoardNav';
import PageSettingsModal from '../components/PageSettingsModal';
import { useTheme } from '../context/ThemeContext.jsx';

const DemoBoard = () => {
  const { colors, accent, theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false);

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const newListInputRef = useRef(null);
  const newListButtonRef = useRef(null);

  // Create a demo board ID to mimic MongoDB ObjectId
  const demoBoardId = 'demo123456789';

  // Initialize lists with proper schema structure
  const [lists, setLists] = useState([
    {
      _id: 'list1',
      name: 'Todo',
      boardId: demoBoardId,
      position: 1,
      color: null
    },
    {
      _id: 'list2',
      name: 'Doing',
      boardId: demoBoardId,
      position: 2,
      color: null
    },
    {
      _id: 'list3',
      name: 'Done',
      boardId: demoBoardId,
      position: 3,
      color: null
    }
  ]);

  // Initialize cards with proper schema structure
  const [cards, setCards] = useState([
    {
      _id: 'card1',
      boardId: demoBoardId,
      listId: 'list1',
      name: 'Hi, welcome to Tremendo',
      description: '',
      position: 1,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card2',
      boardId: demoBoardId,
      listId: 'list1',
      name: 'A simple project management tool',
      description: '',
      position: 2,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card3',
      boardId: demoBoardId,
      listId: 'list1',
      name: 'Give this demoboard a try to see our main features',
      description: '',
      position: 3,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card4',
      boardId: demoBoardId,
      listId: 'list2',
      name: 'Try creating a List or a Card',
      description: '',
      position: 1,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card5',
      boardId: demoBoardId,
      listId: 'list2',
      name: 'Or dragging a card from list to list',
      description: '',
      position: 2,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card6',
      boardId: demoBoardId,
      listId: 'list2',
      name: 'Lists can also be reordered by dragging',
      description: '',
      position: 3,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card7',
      boardId: demoBoardId,
      listId: 'list3',
      name: 'Tremendo is a great way to keep your projects organized and work in teams!',
      description: '',
      position: 1,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card8',
      boardId: demoBoardId,
      listId: 'list3',
      name: 'Tremendo offers an intuitive user interface as well as many different themes',
      description: '',
      position: 2,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'card9',
      boardId: demoBoardId,
      listId: 'list3',
      name: 'Try changing the theme from light to dark to see what Tremendo can do',
      description: '',
      position: 3,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);


  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);

  // Handle clicking outside of the new list input
  const handleClickOutside = (event) => {
    if (
      newListInputRef.current && 
      !newListInputRef.current.contains(event.target) && 
      newListButtonRef.current && 
      !newListButtonRef.current.contains(event.target)
    ) {
      setIsAddingList(false);
      setNewListName('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Counter for new IDs
  const [newListId, setNewListId] = useState(4);
  const [newCardId, setNewCardId] = useState(10);
  const [newCardName, setNewCardName] = useState({});
  const [editListName, setEditListName] = useState({});


  // Create new list
  const handleCreateList = (name) => {
    if (!newListName.trim()) return;

    const newList = {
      _id: `list${newListId}`,
      name: newListName.trim(),
      boardId: demoBoardId,
      position: lists.length + 1,
      color: null
    };
    setLists([...lists, newList]);
    setNewListId(newListId + 1);
    setNewListName('');
  };

   // Update list name
   const handleListNameChange = (listId, newName) => {
    if (!newName) return;
    setLists(lists.map(list =>
      list._id === listId ? { ...list, name: newName } : list
    ));
    // Remove the list ID from editListName instead of setting it to empty string
    setEditListName(prev => {
      const newState = { ...prev };
      delete newState[listId];
      return newState;
    });
  };

  // Handle enter key press for list creation
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCreateList();
    }
  };

  // Delete list
  const handleDeleteList = (listId) => {
    setLists(lists.filter(list => list._id !== listId));
    // Also delete associated cards
    setCards(cards.filter(card => card.listId !== listId));
  };

  // Create card
  const handleCreateCard = (listId, name) => {
    const newCard = {
      _id: `card${newCardId}`,
      boardId: demoBoardId,
      listId,
      name,
      description: '',
      position: cards.filter(card => card.listId === listId).length + 1,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCards([...cards, newCard]);
    setNewCardId(newCardId + 1);
  };

  // Update card
  const handleUpdateCard = (cardId, updates) => {
    setCards(cards.map(card =>
      card._id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
    ));
  };

  // Delete card
  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card._id !== cardId));
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && 
        destination.index === source.index) return;

    if (type === 'LIST') {
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);
      
      const updatedLists = newLists.map((list, index) => ({
        ...list,
        position: index + 1
      }));
      
      setLists(updatedLists);
      return;
    }

    if (type === 'CARD') {
      const startListId = source.droppableId;
      const endListId = destination.droppableId;
      
      // Get all cards for source and destination lists
      const sourceListCards = cards
        .filter(card => card.listId === startListId)
        .sort((a, b) => a.position - b.position);
      
      const destinationListCards = startListId === endListId 
        ? sourceListCards 
        : cards
            .filter(card => card.listId === endListId)
            .sort((a, b) => a.position - b.position);

      const draggedCard = cards.find(card => card._id === draggableId);
      
      if (startListId === endListId) {
        // Moving within the same list
        const newCards = Array.from(sourceListCards);
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, draggedCard);
        
        const updatedCards = newCards.map((card, index) => ({
          ...card,
          position: index + 1,
          updatedAt: new Date()
        }));

        setCards(cards.map(card => 
          card.listId === startListId
            ? updatedCards.find(uc => uc._id === card._id) || card
            : card
        ));
      } else {
        // Moving to a different list
        const sourceCards = Array.from(sourceListCards);
        sourceCards.splice(source.index, 1);
        
        const destCards = Array.from(destinationListCards);
        destCards.splice(destination.index, 0, {
          ...draggedCard,
          listId: endListId
        });

        // Update all affected cards
        const updatedCards = [
          ...sourceCards.map((card, index) => ({
            ...card,
            position: index + 1,
            updatedAt: new Date()
          })),
          ...destCards.map((card, index) => ({
            ...card,
            position: index + 1,
            updatedAt: new Date()
          }))
        ];

        setCards(cards.map(card => {
          if (card.listId === startListId || card.listId === endListId) {
            return updatedCards.find(uc => uc._id === card._id) || card;
          }
          return card;
        }));
      }
    }
  };


  

  

  return (
    <div className="min-h-screen flex flex-col">
     <DemoBoardNav
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        onPageSettings={() => setIsPageSettingsModalOpen(true)}
      />
      
      <div
        className="flex-grow pt-16 overflow-x-auto relative"
        style={{
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          transition: 'background-color 0.2s, color 0.2s'
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex items-start px-6 space-x-4"
                style={{
                  minWidth: 'max-content',
                  minHeight: 'calc(100vh - 64px)',
                }}
              >
                {lists
                  .sort((a, b) => a.position - b.position)
                  .map((list, index) => (
                    <List
                      key={list._id}
                      list={list}
                      cards={cards}
                      index={index}
                      newCardName={newCardName}
                      editListName={editListName}
                      setEditListName={setEditListName}
                      setNewCardName={setNewCardName}
                      handleCreateCard={(listId) => {
                        handleCreateCard(listId, newCardName[listId]);
                        setNewCardName(prev => ({ ...prev, [listId]: '' }));
                      }}
                      handleDeleteList={handleDeleteList}
                      handleListNameChange={handleListNameChange}
                      handleUpdateCard={handleUpdateCard}
                      handleDeleteCard={handleDeleteCard}
                    />
                  ))}
                {provided.placeholder}
                
                {/* Add list button */}
                <div className="w-[264px] shrink-0">
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
                    <div 
                      className="p-2 rounded"
                      style={{
                        backgroundColor: colors.background.secondary,
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <input
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
        </DragDropContext>
      </div>

      <PageSettingsModal
        isOpen={isPageSettingsModalOpen}
        onClose={() => setIsPageSettingsModalOpen(false)}
      />
    </div>
  );
};

export default DemoBoard;