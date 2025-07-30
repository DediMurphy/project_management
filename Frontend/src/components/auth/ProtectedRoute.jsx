import React from 'react';
import { Navigate } from 'react-router-dom'; // pastikan menggunakan -dom
import { useAuthStore } from '../../store/auth/useAuthStore.js';
import { getToken } from '../../utils/token';
import { isTokenExpired } from '../../utils/token.js';

export default function ProtectedRoute({ children }) {
    const { user, clearUser } = useAuthStore();
    const token = getToken();

    if (!token || isTokenExpired(token)) {
        clearUser();
        return <Navigate to="/signin" replace />;
    }

    if (!user) {
        clearUser();
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
}
