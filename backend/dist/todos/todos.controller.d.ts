import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodosController {
    private readonly todosService;
    constructor(todosService: TodosService);
    create(req: any, createTodoDto: CreateTodoDto): Promise<import("mongoose").Document<unknown, {}, import("./todo.schema").TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./todo.schema").Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./todo.schema").TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./todo.schema").Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(req: any, id: string, updateTodoDto: UpdateTodoDto): Promise<import("mongoose").Document<unknown, {}, import("./todo.schema").TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./todo.schema").Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./todo.schema").TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./todo.schema").Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findUserTodos(userId: string, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./todo.schema").TodoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./todo.schema").Todo & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
}
