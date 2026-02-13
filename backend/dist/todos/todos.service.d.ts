import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodosService {
    private todoModel;
    private notificationsService;
    constructor(todoModel: Model<TodoDocument>, notificationsService: NotificationsService);
    create(userId: string, createTodoDto: CreateTodoDto): Promise<import("mongoose").Document<unknown, {}, TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(id: string, userId: string, updateTodoDto: UpdateTodoDto): Promise<import("mongoose").Document<unknown, {}, TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
