import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) {
        // If the user is not authenticated, redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;