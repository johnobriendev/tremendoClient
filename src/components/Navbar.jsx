import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { getButtonStyles } from '../utils/styleSystem';



const Navbar = ({ 
  user, 
  onCreateBoard, 
  onPageSettings, 
  onLogout, 
  isDropdownOpen,
  setIsDropdownOpen,
  settingsRef,
  boardName, 
  showCreateBoard = true,  
}) => {
  const { colors } = useTheme();
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
    <nav 
      className="p-2 fixed top-0 left-0 right-0 z-10" 
      style={{
        backgroundColor: colors.background.navbar,
        color: colors.text.navbar,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
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
              {...getButtonStyles('primary')}
              onClick={onCreateBoard}
            >
              Create New Board
            </button>
          )}
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              className="px-4 py-2 text-sm rounded hover:opacity-90"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              {...getButtonStyles('primary')}
            >
              Settings
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg"
                style={{
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary
                }}
              >
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:opacity-80"
                    style={{ color: colors.text.primary }}
                    onClick={onPageSettings}
                  >
                    Page Settings
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:opacity-80"
                    style={{ color: colors.accent.red }}
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

