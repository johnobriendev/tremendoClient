import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Decode the JWT token to check its expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token has expired
      if (payload.exp < Date.now() / 1000) {
        // If token is expired, check if there is a refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, clear everything and redirect to login
          localStorage.removeItem('token');
          return false;
        }
        // There is a refresh token - the API layer will handle refreshing
        // when making requests, so consider this authenticated
        return true;
      }
      return true;
    } catch (error) {
      // If it can't decode the token, it's invalid
      localStorage.removeItem('token');
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

