import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): any;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("./user.schema").UserDocument>;
    deleteMe(req: any): Promise<void>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        avatar: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<import("./user.schema").UserDocument>;
    softDelete(req: any, id: string): Promise<void>;
    restore(id: string): Promise<void>;
    logoutAll(req: any): Promise<{
        message: string;
    }>;
}
