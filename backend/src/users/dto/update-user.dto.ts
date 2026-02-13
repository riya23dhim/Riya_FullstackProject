import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../user.schema';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
