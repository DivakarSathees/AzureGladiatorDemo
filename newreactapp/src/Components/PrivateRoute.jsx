import React from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './Login';

const PrivateRoute = ({ children }) => {

  // Check if the user is authenticated based on localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? children : <Navigate to="/user/login" replace />;;
};

export default PrivateRoute;
