import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DemoBoardNav = ({ 
  isDropdownOpen, 
  setIsDropdownOpen, 
  onPageSettings 
}) => {
  const { colors, accent } = useTheme();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen]);

  return (
    <div className="p-4 flex justify-between items-center"
      style={{
        backgroundColor: colors.background.navbar,
        color: colors.text.primary
      }}
    >
      <h2 className="text-xl font-semibold">Demo Board</h2>
      
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: accent.primary,
            color: '#ffffff'
          }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Settings
        </button>
        {isDropdownOpen && (
          <div 
            className="absolute right-0 mt-2 w-48 z-20 rounded-md shadow-lg"
            style={{
              backgroundColor: colors.background.secondary,
              color: colors.text.primary
            }}
          >
            <div className="py-1">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:opacity-80"
                onClick={() => {
                  onPageSettings();
                  setIsDropdownOpen(false);
                }}
              >
                Theme Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoBoardNav;