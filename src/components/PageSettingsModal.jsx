import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';




const PageSettingsModal = ({ isOpen, onClose }) => {
  const { colors, accent, theme, setTheme, availableThemes } = useTheme();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
       // Prevent background scrolling when modal is open
       document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Re-enable scrolling when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <div
          ref={modalRef}
          className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform rounded-lg shadow-xl relative"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            // maxHeight: '85vh',
            // overflowY: 'auto'
          }}
        >
          <h2 className="text-xl font-bold mb-4">Page Settings</h2>

          {/* Theme Section */}
          <div className="mb-6">
            <p className="font-medium mb-2">Theme</p>
            <div className="grid grid-cols-2 gap-2">
              {availableThemes.map((themeName) => (
                <button
                  key={themeName}
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-all capitalize"
                  style={{
                    backgroundColor: theme === themeName ? accent.primary : colors.background.tertiary,
                    color: theme === themeName ? '#ffffff' : colors.text.primary,
                    transition: 'background-color 0.2s, color 0.2s'
                  }}
                  onClick={() => setTheme(themeName)}
                >
                  {themeName} Theme
                </button>
              ))}
            </div>
          </div>


          {/* Close Button */}
          <button
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: accent.danger,
              color: '#ffffff'
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

};

export default PageSettingsModal;
