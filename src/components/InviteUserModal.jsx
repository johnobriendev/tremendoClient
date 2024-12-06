import React, { useState, useEffect, useRef } from 'react';

export default function InviteUserModal({ isOpen, onClose, onInviteUser, theme, getModalStyles }) {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState('');
  const modalRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      emailInputRef.current?.focus();
      setStatusMessage(null);
      setStatusType('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onInviteUser(email);
      setStatusMessage('Invitation sent successfully');
      setStatusType('success');
      setEmail('');
    } catch (error) {
      // Handle different error response structures
      const errorMessage = error.response?.data?.message || // Standard API error message
                          error.response?.data?.errors?.[0]?.msg || // Express validator error
                          error.message || // Direct error message
                          'An error occurred'; // Fallback message
      
      setStatusMessage(errorMessage);
      setStatusType('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef} 
        className="p-6 rounded shadow max-w-md w-full"
        style={getModalStyles(theme === 'dark')}
      >
        <h2 className="text-xl font-bold mb-4">Invite User to Board</h2>
        
        {statusMessage && (
          <div
            className={`mb-4 p-2 rounded ${
              statusType === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {statusMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className={`block mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Email
            </label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-black border-gray-300'
              }`}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  //     <div ref={modalRef} className="bg-white rounded-lg p-8 max-w-md w-full">
  //       <h2 className="text-2xl font-bold mb-4">Invite User to Board</h2>
  //       {statusMessage && (
  //         <div
  //           className={`mb-4 p-2 rounded ${
  //             statusType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  //           }`}
  //         >
  //           {statusMessage}
  //         </div>
  //       )}
  //       <form onSubmit={handleSubmit}>
  //         <div className="mb-4">
  //           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
  //             Email
  //           </label>
  //           <input
  //             id="email"
  //             type="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             required
  //           />
  //         </div>
  //         <div className="flex justify-end space-x-2">
  //           <button
  //             type="button"
  //             onClick={onClose}
  //             className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             type="submit"
  //             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  //           >
  //             Invite
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
}