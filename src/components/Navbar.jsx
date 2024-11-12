import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ 
  user, 
  onCreateBoard, 
  onPageSettings, 
  onLogout, 
  theme,
  isDropdownOpen,
  setIsDropdownOpen,
  getNavBarStyles,
  settingsRef,
  boardName, 
  showCreateBoard = true,  
}) => {

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen]);
  return (
    <nav className="p-2 fixed top-0 left-0 right-0 z-10" style={getNavBarStyles(theme === 'dark')}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-2xl font-semibold">
            Tremendo
          </Link>
          {boardName && <h1 className="text-2xl ml-4">{boardName}</h1>}
          {!boardName && user && <h1 className="text-2xl ml-4">Welcome, {user.name}!</h1>}
        </div>
        
        <div className="flex items-center space-x-4">
          {showCreateBoard && (
            <button
              className={`px-4 py-2 text-sm rounded ${
                theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}
              onClick={onCreateBoard}
            >
              Create New Board
            </button>
          )}
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              className={`px-4 py-2 text-sm rounded ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Settings
            </button>
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={onPageSettings}
                  >
                    Page Settings
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={onLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
    

export default Navbar;

