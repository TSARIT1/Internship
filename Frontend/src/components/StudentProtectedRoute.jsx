
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const StudentProtectedRoute = ({ children }) => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const student = JSON.parse(sessionStorage.getItem('student'));

    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Strict check: User must be logged in AND have a valid ID
    if (!student || !student.id) {
        // Clear invalid session data if it exists but has no ID
        if (student) sessionStorage.removeItem('student');
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default StudentProtectedRoute;
