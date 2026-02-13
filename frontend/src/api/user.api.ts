import { api } from './axios';
import type { User } from '../types/user';

export const userApi = {
    getMe: () => api.get<User>('/users/me'),
    updateMe: (data: Partial<User>) => api.patch<User>('/users/me', data),
    uploadAvatar: (formData: FormData) => api.post<{ avatar: string }>('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteMe: () => api.delete('/users/me'),
    // Admin routes
    getAllUsers: (page = 1, limit = 10) => api.get<{ data: User[], total: number }>(`/users?page=${page}&limit=${limit}`),
    updateUser: (id: string, data: any) => api.patch(`/users/${id}`, data),
    softDeleteUser: (id: string) => api.delete(`/users/${id}`),
    restoreUser: (id: string) => api.patch(`/users/${id}/restore`),
    logoutAll: () => api.post('/users/logout-all'),
};
