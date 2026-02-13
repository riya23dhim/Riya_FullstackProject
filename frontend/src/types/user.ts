export type UserRole = 'USER' | 'ADMIN';

export type User = {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    isDeleted: boolean;
    avatar?: string;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type AuthState = {
    user: User | null;
    tokens: AuthTokens | null;
};

export type Pagination = {
    page: number;
    limit: number;
    total: number;
};
