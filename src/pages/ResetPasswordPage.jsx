import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../utils/api';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('Component: Passwords do not match');
      setError('Passwords do not match');
      return;
    }
    try {
      console.log('Component: Calling resetPassword API');
      const data = await resetPassword(token, { password, confirmPassword });
      console.log('Component: API call successful:', data);
      setMessage(data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.log('Component: API call failed:', err);

      setError(err.message || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">Reset Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor='new-password' className="block text-gray-700 mb-2">New Password</label>
            <input
              id='new-password'
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor='confirm-new-password' className="block text-gray-700 mb-2">Confirm New Password</label>
            <input
              id='confirm-new-password'
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                  aria-label="Show password"
                />
                Show Password
              </label>
           </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;