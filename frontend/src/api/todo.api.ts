import { api } from './axios';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

export const todoApi = {
    getAll: (page = 1, limit = 10) => api.get<{ data: Todo[], total: number }>(`/todos?page=${page}&limit=${limit}`),
    create: (data: CreateTodoDto) => api.post<Todo>('/todos', data),
    update: (id: string, data: UpdateTodoDto) => api.patch<Todo>(`/todos/${id}`, data),
    delete: (id: string) => api.delete(`/todos/${id}`),
    getUserTodos: (userId: string, page = 1, limit = 10) => api.get<{ data: Todo[], total: number }>(`/todos/user/${userId}?page=${page}&limit=${limit}`),
};
