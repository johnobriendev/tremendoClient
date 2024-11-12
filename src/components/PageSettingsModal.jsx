import React, { useRef, useEffect } from 'react';

const PageSettingsModal = ({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange, 
  backgroundImages, 
  currentBackground,
  onBackgroundSelect,
  onRemoveBackground,
  getModalStyles, 
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="p-6 rounded shadow-lg" style={getModalStyles(theme === 'dark')}  
      >
        <h2 className="text-xl font-bold mb-4">Page Settings</h2>
        <p className="mb-4">Customize your dashboard:</p>

        <div className="flex flex-col space-y-2 mb-4">
          <p>Theme:</p>
          <button
            className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => onThemeChange('light')}
          >
            Light Mode
          </button>
          <button
            className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
            onClick={() => onThemeChange('dark')}
          >
            Dark Mode
          </button>
        </div>

        <div className="mb-4">
          <p>Background Image:</p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {backgroundImages.map((image) => (
              <button
                key={image.url}
                className={`border-2 rounded ${currentBackground === image.url ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => onBackgroundSelect(image.url)}
              >
                <div 
                  className="w-20 h-20 bg-cover bg-center" 
                  style={{backgroundImage: image.thumbnail}}
                />
                <p className="text-center mt-1">{image.label}</p>
              </button>
            ))}
          </div>
          <button
            className={`w-full mt-2 px-4 py-2 rounded ${
              currentBackground === null ? 'bg-blue-500 text-white' : (theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black')
            }`}
            onClick={onRemoveBackground}
          >
            No Background Image
          </button>
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PageSettingsModal;

