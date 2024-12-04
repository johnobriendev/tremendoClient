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
        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        {/* Dark overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        {/* Modal panel */}
        <div
          ref={modalRef}
          className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform rounded-lg shadow-xl relative"
          style={{
            ...getModalStyles(theme === 'dark'),
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
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
                  <p className="text-center mt-1 text-sm">{image.label}</p>
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
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
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

// return (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//     <div
//       ref={modalRef}
//       className="p-6 rounded shadow-lg" style={getModalStyles(theme === 'dark')}  
//     >
//       <h2 className="text-xl font-bold mb-4">Page Settings</h2>
//       <p className="mb-4">Customize your dashboard:</p>

//       <div className="flex flex-col space-y-2 mb-4">
//         <p>Theme:</p>
//         <button
//           className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
//           onClick={() => onThemeChange('light')}
//         >
//           Light Mode
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
//           onClick={() => onThemeChange('dark')}
//         >
//           Dark Mode
//         </button>
//       </div>

//       <div className="mb-4">
//         <p>Background Image:</p>
//         <div className="grid grid-cols-3 gap-2 mb-2">
//           {backgroundImages.map((image) => (
//             <button
//               key={image.url}
//               className={`border-2 rounded ${currentBackground === image.url ? 'border-blue-500' : 'border-transparent'}`}
//               onClick={() => onBackgroundSelect(image.url)}
//             >
//               <div 
//                 className="w-20 h-20 bg-cover bg-center" 
//                 style={{backgroundImage: image.thumbnail}}
//               />
//               <p className="text-center mt-1">{image.label}</p>
//             </button>
//           ))}
//         </div>
//         <button
//           className={`w-full mt-2 px-4 py-2 rounded ${
//             currentBackground === null ? 'bg-blue-500 text-white' : (theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black')
//           }`}
//           onClick={onRemoveBackground}
//         >
//           No Background Image
//         </button>
//       </div>
//       <button
//         className="bg-red-500 text-white px-4 py-2 rounded"
//         onClick={onClose}
//       >
//         Close
//       </button>
//     </div>
//   </div>
// );