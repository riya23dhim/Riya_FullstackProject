import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    avatar: string;

    @Prop({ type: [String], default: [] })
    refreshTokens: string[];

    @Prop({ type: String, default: null })
    resetToken: string | null;

    @Prop({ type: Date, default: null })
    resetTokenExpiry: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
