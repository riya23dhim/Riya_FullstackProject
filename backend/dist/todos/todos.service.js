"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const todo_schema_1 = require("./todo.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let TodosService = class TodosService {
    constructor(todoModel, notificationsService) {
        this.todoModel = todoModel;
        this.notificationsService = notificationsService;
    }
    async create(userId, createTodoDto) {
        const todo = await this.todoModel.create({ ...createTodoDto, user: userId });
        await this.notificationsService.create(userId, `Task "${todo.title}" created successfully.`);
        return todo;
    }
    async findAll(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const todos = await this.todoModel
            .find({ user: userId })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.todoModel.countDocuments({ user: userId });
        return { data: todos, total, page, limit };
    }
    async update(id, userId, updateTodoDto) {
        const todo = await this.todoModel.findOneAndUpdate({ _id: id, user: userId }, updateTodoDto, { returnDocument: 'after' }).exec();
        if (!todo)
            throw new common_1.NotFoundException('Todo not found');
        await this.notificationsService.create(userId, `Task "${todo.title}" updated.`);
        return todo;
    }
    async remove(id, userId) {
        const todo = await this.todoModel.findOneAndDelete({ _id: id, user: userId }).exec();
        if (!todo)
            throw new common_1.NotFoundException('Todo not found');
        await this.notificationsService.create(userId, `Task "${todo.title}" deleted.`);
        return todo;
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(todo_schema_1.Todo.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService])
], TodosService);
//# sourceMappingURL=todos.service.js.map