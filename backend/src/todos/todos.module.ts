import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todo, TodoSchema } from './todo.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
        NotificationsModule,
    ],
    controllers: [TodosController],
    providers: [TodosService],
})
export class TodosModule { }
