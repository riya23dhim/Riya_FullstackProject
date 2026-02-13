import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    role?: string;
    // optional, but usually set via separate logic or removed. 
    // For simplicity, users can pass role if minimal RBAC setup, but typically we prevent user-set roles.
    // For this intern app, I'll allow it or set explicitly on backend.
}
