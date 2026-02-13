import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { SignupDto } from '../auth/dto/signup.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(signupDto: SignupDto): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    update(id: string, updateData: Partial<User>): Promise<UserDocument>;
    addRefreshToken(id: string, refreshToken: string): Promise<void>;
    removeRefreshToken(id: string, refreshToken: string): Promise<void>;
    findAll(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    logoutAll(): Promise<void>;
    logoutUserAllDevices(id: string): Promise<void>;
}
