import { api } from './axios';
import type { AuthTokens } from '../types/user';

export const authApi = {
    signup: (data: any) => api.post<{ tokens: AuthTokens; user: any }>('/auth/signup', data),
    login: (data: any) => api.post<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken: string) => api.post<AuthTokens>('/auth/refresh', { refreshToken }),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, id: string, newPass: string) => api.post('/auth/reset-password', { token, id, newPass }),
};
