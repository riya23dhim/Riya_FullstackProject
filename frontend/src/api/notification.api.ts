import { api } from './axios';
import type { Notification } from '../types/notification';

export const notificationApi = {
    getAll: (page = 1, limit = 10) => api.get<{ data: Notification[], total: number }>(`/notifications?page=${page}&limit=${limit}`),
    markAsRead: (id: string) => api.patch<Notification>(`/notifications/${id}/read`),
};
