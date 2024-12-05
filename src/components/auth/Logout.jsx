import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data (localStorage, sessionStorage, cookies, or context)
    localStorage.removeItem('token'); // Example: remove token from localStorage
    sessionStorage.removeItem('token'); // Optional: Remove token from sessionStorage

    // Redirect to login page after logout
    navigate('/login');
  };

  React.useEffect(() => {
    handleLogout(); // Call logout when component mounts
  }, []);

  return <div>Logging out...</div>; // Optional: Show loading message or animation
};

export default Logout;
