export interface Todo {
    _id: string;
    title: string;
    description?: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTodoDto {
    title: string;
    description?: string;
}

export interface UpdateTodoDto {
    title?: string;
    description?: string;
}
