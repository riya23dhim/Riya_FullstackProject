import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';
export type TodoDocument = Todo & Document;
export declare class Todo {
    title: string;
    description: string;
    user: User;
}
export declare const TodoSchema: MongooseSchema<Todo, import("mongoose").Model<Todo, any, any, any, (Document<unknown, any, Todo, any, import("mongoose").DefaultSchemaOptions> & Todo & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Todo, any, import("mongoose").DefaultSchemaOptions> & Todo & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Todo>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Todo, Document<unknown, {}, Todo, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Todo & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Todo, Document<unknown, {}, Todo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Todo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Todo, Document<unknown, {}, Todo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Todo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    user?: import("mongoose").SchemaDefinitionProperty<User, Todo, Document<unknown, {}, Todo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Todo & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Todo>;
