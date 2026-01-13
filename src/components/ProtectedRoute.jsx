import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('adminToken');

    if (!isAdmin || !token) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
