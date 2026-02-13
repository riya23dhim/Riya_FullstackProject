import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/user';
import Loading from '../pages/Loading';

export const ProtectedRoute = ({ children, roles }: { children: ReactNode; roles?: UserRole[] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();

    if (isLoading) return <Loading />;

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (roles && !roles.includes(user?.role!)) {
        navigate('/');
        return null;
    }

    return children;
};
