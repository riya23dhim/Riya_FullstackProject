import { UserRole } from '../user.schema';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    role?: UserRole;
}
