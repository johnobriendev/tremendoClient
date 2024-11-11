import React from 'react'

const backgroundImages = [
  { url: "url('/bsas5.webp')", label: 'street', thumbnail: "url('/bsas5thumb.webp')" },
  { url: "url('/bsas7.webp')", label: 'park', thumbnail: "url('/bsas7thumb.webp')" },
  { url: "url('/bsas1.webp')", label: 'city', thumbnail: "url('/bsas1thumb.webp')" },
  { url: "url('/bsas4.webp')", label: 'train', thumbnail: "url('/bsas4thumb.webp')" },
]

export function PageSettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  backgroundImage,
  onBackgroundImageSelect,
  onRemoveBackgroundImage,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Page Settings</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Theme</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="light"
                checked={theme === 'light'}
                onChange={() => onThemeChange('light')}
                className="mr-2"
              />
              Light
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="dark"
                checked={theme === 'dark'}
                onChange={() => onThemeChange('dark')}
                className="mr-2"
              />
              Dark
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Background Image</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {backgroundImages.map((image) => (
              <button
                key={image.url}
                className={`h-20 border-2 ${backgroundImage === image.url ? 'border-blue-500' : 'border-gray-300'}`}
                style={{ backgroundImage: image.thumbnail, backgroundSize: 'cover' }}
                onClick={() => onBackgroundImageSelect(image.url)}
              >
                <span className="sr-only">{image.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onRemoveBackgroundImage}
            className={`w-full py-2 px-4 border ${backgroundImage === null ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            No Background
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}