import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/axios';
import { userApi } from '../api/user.api';
import type { User, AuthTokens } from '../types/user';

interface AuthContextType {
    user: User | null;
    tokens: AuthTokens | null;
    login: (tokens: AuthTokens, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const at = localStorage.getItem('accessToken');
            const rt = localStorage.getItem('refreshToken');

            if (at && rt) {
                setTokens({ accessToken: at, refreshToken: rt });
                try {
                    const { data } = await userApi.getMe();
                    setUser(data);
                } catch {
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (tokens: AuthTokens, user: User) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        setTokens(tokens);
        setUser(user);

    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setTokens(null);
        setUser(null);

    };

    return (
        <AuthContext.Provider value={{ user, tokens, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
