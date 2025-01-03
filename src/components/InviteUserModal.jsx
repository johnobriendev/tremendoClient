import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function InviteUserModal({ isOpen, onClose, onInviteUser,}) {
  const { colors, accent } = useTheme();
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div 
        ref={modalRef}
        className="relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        style={{
          backgroundColor: colors.background.secondary,
          color: colors.text.primary
        }}
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
              className="block mb-2"
            >
              Email
            </label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary,
                border: `1px solid ${colors.text.muted}`
              }}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: accent.danger,
                color: '#ffffff'
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: accent.primary,
                color: '#ffffff'
              }}
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};