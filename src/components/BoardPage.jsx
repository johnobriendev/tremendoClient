import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import List from './List'; // Import List component





function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [editListName, setEditListName] = useState({});

  //list input stuff
  const [isAddingList, setIsAddingList] = useState(false);
  const newListInputRef = useRef(null);
  const newListButtonRef = useRef(null);

  // New state variables for page settings
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const savedBackground = localStorage.getItem('backgroundImage');
    return savedBackground === 'null' ? null : (savedBackground || "url('/bsas1.webp')");
  });

  // New refs for handling click outside
  const settingsRef = useRef(null);
  const pageSettingsModalRef = useRef(null);

  const backgroundImages = [
    { url: "url('/bsas5.webp')" , label: 'street', thumbnail: "url('/bsas5thumb.webp')" },
    { url: "url('/bsas7.webp')" , label: 'park', thumbnail: "url('/bsas7thumb.webp')" },
    { url: "url('/bsas1.webp')" , label: 'city', thumbnail: "url('/bsas1thumb.webp')" },
    { url: "url('/bsas4.webp')" , label: 'train', thumbnail: "url('/bsas4thumb.webp')" },
  ];
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const handleBackgroundImageSelect = (url) => {
    setBackgroundImage(url);
    localStorage.setItem('backgroundImage', url);
  };
  
  const handleRemoveBackgroundImage = () => {
    setBackgroundImage(null);
    localStorage.setItem('backgroundImage', null);
  };
  
  const getThemeStyles = (isDark) => ({
    backgroundColor: isDark ? '#1F2937' : '#dae8f1' , //'#181d28' '#b1cee2'
    color: isDark ? '#CBD5E0' : '#1A202C', //#fff #000
  });
  
  const getModalStyles = (isDark) => ({
    backgroundColor: isDark ? '#4a5568' : '#dadde2',
    color: isDark ? '#CBD5E0' : '#1A202C', //#fff #000
  });
  
  const getNavBarStyles = (isDark) => ({
    backgroundColor: isDark ? '#1a202c' : '#E2E8F0', //#e4eef5
    color: isDark ? '#CBD5E0' : '#1A202C',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  });
  const getAddListStyles = (isDark) => ({
    backgroundColor: isDark ? '#2B2F3A' : '#E5E7EB',
    color: isDark ? '#CBD5E0' : '#1A202C',
  });
  


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
      const listsResponse = await fetch(`${apiBaseUrl}/lists/${boardId}`, {
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


  //list input stuff, focus input when add list is clicked
  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);

  const handleCreateList = async () => {
    if (newListName.trim() === '') return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/lists/${boardId}`, {
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
      //list input stuff
      setIsAddingList(false);

    } catch (error) {
      console.error('Error creating list:', error);
    }
  };


  //list input stuff
  const handleClickOutside = (event) => {
    if (newListInputRef.current && !newListInputRef.current.contains(event.target) && !newListButtonRef.current.contains(event.target)) {
      setIsAddingList(false);
      setNewListName('');
    }
    if (isDropdownOpen && settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (isPageSettingsModalOpen && pageSettingsModalRef.current && !pageSettingsModalRef.current.contains(event.target)) {
      setIsPageSettingsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isPageSettingsModalOpen]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCreateList();
    }
  };



  const handleListNameChange = async (listId, newName) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/lists/${listId}`, {
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
      const response = await fetch(`${apiBaseUrl}/lists/${listId}`, {
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

  // Add the functions here
const handleUpdateCard = async (cardId, updates) => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/cards/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Error updating card: ${response.statusText}`);
    }
    const updatedCard = await response.json();
    
    // Update the card in the local state
    setCards(cards.map(card => card._id === cardId ? updatedCard : card));
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

const handleDeleteCard = async (cardId) => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/cards/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting card: ${response.statusText}`);
    }
    // Remove the deleted card from the local state
    setCards(cards.filter(card => card._id !== cardId));
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
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
    <div 
      className={`min-h-screen flex flex-col ${
        backgroundImage ? "bg-cover bg-center bg-no-repeat bg-fixed" : ""
      }`}
      style={{
        ...(backgroundImage ? { backgroundImage } : getThemeStyles(theme === 'dark')),
      }}
    >
       <nav 
        className="p-2 fixed top-0 left-0 right-0 z-10"
        style={getNavBarStyles(theme === 'dark')}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to='/dashboard' className='text-2xl font-semibold'>Tremendo</Link>
          <h1 className="text-2xl">{board?.name}</h1>
          <div className="flex items-center space-x-4">
            <div 
              className="relative inline-block text-left"
              ref={settingsRef}
            >
              <button
                className={`px-4 py-2 text-sm rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Settings
              </button>
              {isDropdownOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                    theme === 'dark' ? 'bg-[#2B2F3A]' : 'bg-[#dadde2]'
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsPageSettingsModalOpen(true);
                      }}
                    >
                      Page Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className='pt-16 overflow-x-auto'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='flex-grow  w-full'>
            <Droppable droppableId="all-lists" direction="horizontal">
              {(provided) => (
                <div
                  className="flex items-start p-6 space-x-4 "
                  style={{
                    paddingRight: '1.5rem',
                    minWidth: 'max-content',
                    minHeight: 'calc(100vh - 100px)' //can be adjusted if more space is needed
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
                          theme === 'dark' ? 'bg-[#2B2F3A] hover:bg-opacity-70 text-[#CBD5E0]'  :  'bg-[#dadde2] hover:bg-opacity-70'
                        }`}
                        // style={getAddListStyles(theme === 'dark')}
                      >
                      + Add another list 
                      </button>
                    ) : (
                      <div  className={`${
                        theme === 'dark' ? 'bg-[#2B2F3A]' :  'bg-[#dadde2]'
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
      
      {isPageSettingsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="p-6 rounded shadow-lg"
            style={getModalStyles(theme === 'dark')}
            ref={pageSettingsModalRef}
          >
            <h2 className="text-xl font-bold mb-4">Page Settings</h2>
            <p className="mb-4">Customize your board:</p>

            {/* Theme Options */}
            <div className="flex flex-col space-y-2 mb-4">
              <p>Theme:</p>
              <button
                className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => handleThemeChange('light')}
              >
                Light Mode
              </button>
              <button
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                onClick={() => handleThemeChange('dark')}
              >
                Dark Mode
              </button>
            </div>

            {/* Background Image Options */}
            <div className="mb-4">
              <p>Background Image:</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {backgroundImages.map((image) => (
                  <button
                    key={image.url}
                    className={`border-2 rounded ${backgroundImage === image.url ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => handleBackgroundImageSelect(image.url)}
                  >
                    
                    <div className="w-20 h-20 bg-cover bg-center" style={{backgroundImage: image.thumbnail}}></div>
                    <p className="text-center mt-1">{image.label}</p>
                  </button>
                ))}
              </div>
              <button
                className={`w-full mt-2 px-4 py-2 rounded ${
                  backgroundImage === null ? 'bg-blue-500 text-white' : (theme === 'dark' ? 'bg-green-500 text-white' : 'bg-green-500 text-white')
                }`}
                onClick={handleRemoveBackgroundImage}
              >
                No Background Image
              </button>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setIsPageSettingsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
    </div>



  
     
      
    
  );
 
}

export default BoardPage;




  