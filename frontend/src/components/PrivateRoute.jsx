import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext  from '../context/AuthContext';

const PrivateRoute = ({ children }) => {

  const { auth } = useContext(AuthContext);
  const { isAuthenticated, loading } = auth;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;