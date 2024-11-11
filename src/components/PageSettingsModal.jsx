import React from 'react';

const PageSettingsModal = ({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange, 
  backgroundImages, 
  currentBackground,
  onBackgroundSelect,
  onRemoveBackground,
  getModalStyles 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded shadow-lg" style={getModalStyles(theme === 'dark')}>
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



// import React from 'react';

// const PageSettingsModal = ({
//   isOpen,
//   onClose,
//   theme,
//   onThemeChange,
//   backgroundImage,
//   onBackgroundImageSelect,
//   onRemoveBackgroundImage,
//   backgroundImages
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="p-6 rounded shadow-lg" style={{ backgroundColor: theme === 'dark' ? '#4a5568' : '#dadde2' }}>
//         <h2 className="text-xl font-bold mb-4">Page Settings</h2>
//         <div className="flex flex-col space-y-2 mb-4">
//           <p>Theme:</p>
//           <button
//             className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
//             onClick={() => onThemeChange('light')}
//           >
//             Light Mode
//           </button>
//           <button
//             className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
//             onClick={() => onThemeChange('dark')}
//           >
//             Dark Mode
//           </button>
//         </div>
//         <div className="mb-4">
//           <p>Background Image:</p>
//           <div className="grid grid-cols-3 gap-2 mb-2">
//             {backgroundImages.map((image) => (
//               <button
//                 key={image.url}
//                 className={`border-2 rounded ${backgroundImage === image.url ? 'border-blue-500' : 'border-transparent'}`}
//                 onClick={() => onBackgroundImageSelect(image.url)}
//               >
//                 <div className="w-20 h-20 bg-cover bg-center" style={{ backgroundImage: image.thumbnail }}></div>
//                 <p className="text-center mt-1">{image.label}</p>
//               </button>
//             ))}
//           </div>
//           <button
//             className={`w-full mt-2 px-4 py-2 rounded ${backgroundImage === null ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
//             onClick={onRemoveBackgroundImage}
//           >
//             No Background Image
//           </button>
//         </div>
//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PageSettingsModal;



// import React from 'react'

// const backgroundImages = [
//   { url: "url('/bsas5.webp')", label: 'street', thumbnail: "url('/bsas5thumb.webp')" },
//   { url: "url('/bsas7.webp')", label: 'park', thumbnail: "url('/bsas7thumb.webp')" },
//   { url: "url('/bsas1.webp')", label: 'city', thumbnail: "url('/bsas1thumb.webp')" },
//   { url: "url('/bsas4.webp')", label: 'train', thumbnail: "url('/bsas4thumb.webp')" },
// ]

// export function PageSettingsModal({
//   isOpen,
//   onClose,
//   theme,
//   onThemeChange,
//   backgroundImage,
//   onBackgroundImageSelect,
//   onRemoveBackgroundImage,
// }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-6 w-96">
//         <h2 className="text-2xl font-bold mb-4">Page Settings</h2>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-2">Theme</h3>
//           <div className="flex space-x-4">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="light"
//                 checked={theme === 'light'}
//                 onChange={() => onThemeChange('light')}
//                 className="mr-2"
//               />
//               Light
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="dark"
//                 checked={theme === 'dark'}
//                 onChange={() => onThemeChange('dark')}
//                 className="mr-2"
//               />
//               Dark
//             </label>
//           </div>
//         </div>
//         <div>
//           <h3 className="font-semibold mb-2">Background Image</h3>
//           <div className="grid grid-cols-2 gap-2 mb-2">
//             {backgroundImages.map((image) => (
//               <button
//                 key={image.url}
//                 className={`h-20 border-2 ${backgroundImage === image.url ? 'border-blue-500' : 'border-gray-300'}`}
//                 style={{ backgroundImage: image.thumbnail, backgroundSize: 'cover' }}
//                 onClick={() => onBackgroundImageSelect(image.url)}
//               >
//                 <span className="sr-only">{image.label}</span>
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={onRemoveBackgroundImage}
//             className={`w-full py-2 px-4 border ${backgroundImage === null ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
//           >
//             No Background
//           </button>
//         </div>
//         <button
//           onClick={onClose}
//           className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   )
// }