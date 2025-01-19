// components/AuthRoute.jsx
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRoute;