
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const StudentProtectedRoute = ({ children }) => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const student = JSON.parse(sessionStorage.getItem('student'));

    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (!student) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default StudentProtectedRoute;
