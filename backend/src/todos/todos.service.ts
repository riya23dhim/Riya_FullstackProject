import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
        private notificationsService: NotificationsService,
    ) { }

    async create(userId: string, createTodoDto: CreateTodoDto) {
        const todo = await this.todoModel.create({ ...createTodoDto, user: userId as any });
        await this.notificationsService.create(userId, `Task "${(todo as any).title}" created successfully.`);
        return todo;
    }

    async findAll(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const todos = await this.todoModel
            .find({ user: userId as any })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.todoModel.countDocuments({ user: userId as any });
        return { data: todos, total, page, limit };
    }

    async update(id: string, userId: string, updateTodoDto: UpdateTodoDto) {
        const todo = await this.todoModel.findOneAndUpdate(
            { _id: id, user: userId as any } as any,
            updateTodoDto,
            { returnDocument: 'after' }
        ).exec();
        if (!todo) throw new NotFoundException('Todo not found');
        await this.notificationsService.create(userId, `Task "${(todo as any).title}" updated.`);
        return todo;
    }

    async remove(id: string, userId: string) {
        const todo = await this.todoModel.findOneAndDelete({ _id: id, user: userId as any } as any).exec();
        if (!todo) throw new NotFoundException('Todo not found');
        await this.notificationsService.create(userId, `Task "${(todo as any).title}" deleted.`);
        return todo;
    }
}
