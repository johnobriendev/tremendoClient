import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import List from '../components/List';
import Navbar from '../components/Navbar';
import PageSettingsModal from '../components/PageSettingsModal';
import { useTheme } from '../context/ThemeContext.jsx';

const DemoBoard = () => {
  const { colors, accent, theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false);

  // Initial demo data
  const [lists, setLists] = useState([
    {
      _id: 'list-1',
      name: 'Todo',
      position: 1,
      cards: [
        { _id: 'card-1', name: 'Hi, welcome to Tremendo', position: 1 },
        { _id: 'card-2', name: 'A simple project management tool', position: 2 },
        { _id: 'card-3', name: 'Give this demoboard a try to see our main features', position: 3 }
      ]
    },
    {
      _id: 'list-2',
      name: 'Doing',
      position: 2,
      cards: [
        { _id: 'card-4', name: 'Try creating a List or a Card', position: 1 },
        { _id: 'card-5', name: 'Or dragging a card from list to list', position: 2 },
        { _id: 'card-6', name: 'Lists can also be reordered by dragging', position: 3 }
      ]
    },
    {
      _id: 'list-3',
      name: 'Done',
      position: 3,
      cards: [
        { _id: 'card-7', name: 'Tremendo is a great way to keep your projects organized and work in teams!', position: 1 },
        { _id: 'card-8', name: 'Tremendo offers an intuitive user interface as well as many different themes', position: 2 },
        { _id: 'card-9', name: 'Try changing the theme from light to dark to see what Tremendo can do', position: 3 }
      ]
    }
  ]);

  const [newListId, setNewListId] = useState(4);
  const [newCardId, setNewCardId] = useState(10);

  // Create new list
  const handleCreateList = (name) => {
    const newList = {
      _id: `list-${newListId}`,
      name,
      position: lists.length + 1,
      cards: []
    };
    setLists([...lists, newList]);
    setNewListId(newListId + 1);
  };

  // Update list
  const handleUpdateList = (listId, updates) => {
    setLists(lists.map(list => 
      list._id === listId ? { ...list, ...updates } : list
    ));
  };

  // Delete list
  const handleDeleteList = (listId) => {
    setLists(lists.filter(list => list._id !== listId));
  };

  // Create card
  const handleCreateCard = (listId, name) => {
    const newCard = {
      _id: `card-${newCardId}`,
      name,
      position: lists.find(list => list._id === listId).cards.length + 1
    };
    
    setLists(lists.map(list => 
      list._id === listId
        ? { ...list, cards: [...list.cards, newCard] }
        : list
    ));
    setNewCardId(newCardId + 1);
  };

  // Update card
  const handleUpdateCard = (cardId, updates) => {
    setLists(lists.map(list => ({
      ...list,
      cards: list.cards.map(card =>
        card._id === cardId ? { ...card, ...updates } : card
      )
    })));
  };

  // Delete card
  const handleDeleteCard = (cardId) => {
    setLists(lists.map(list => ({
      ...list,
      cards: list.cards.filter(card => card._id !== cardId)
    })));
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

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
      const sourceList = lists.find(list => list._id === source.droppableId);
      const destList = lists.find(list => list._id === destination.droppableId);
      const draggedCard = sourceList.cards.find(card => card._id === draggableId);

      if (source.droppableId === destination.droppableId) {
        // Moving within the same list
        const newCards = Array.from(sourceList.cards);
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, draggedCard);

        const updatedCards = newCards.map((card, index) => ({
          ...card,
          position: index + 1
        }));

        setLists(lists.map(list =>
          list._id === sourceList._id
            ? { ...list, cards: updatedCards }
            : list
        ));
      } else {
        // Moving to a different list
        const sourceCards = Array.from(sourceList.cards);
        const destCards = Array.from(destList.cards);
        
        sourceCards.splice(source.index, 1);
        destCards.splice(destination.index, 0, draggedCard);

        setLists(lists.map(list => {
          if (list._id === source.droppableId) {
            return { ...list, cards: sourceCards };
          }
          if (list._id === destination.droppableId) {
            return { ...list, cards: destCards };
          }
          return list;
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        boardName="Demo Board"
        showCreateBoard={false}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        onPageSettings={() => setIsPageSettingsModalOpen(true)}
        onLogout={() => {}}
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
                      cards={list.cards}
                      index={index}
                      onCreateCard={(name) => handleCreateCard(list._id, name)}
                      onDeleteList={() => handleDeleteList(list._id)}
                      onUpdateList={(updates) => handleUpdateList(list._id, updates)}
                      onUpdateCard={handleUpdateCard}
                      onDeleteCard={handleDeleteCard}
                    />
                  ))}
                {provided.placeholder}
                
                {/* Add list button */}
                <div className="w-72 shrink-0">
                  <button
                    onClick={() => handleCreateList('New List')}
                    className="w-full py-2 px-4 rounded"
                    style={{
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary
                    }}
                  >
                    + Add another list
                  </button>
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