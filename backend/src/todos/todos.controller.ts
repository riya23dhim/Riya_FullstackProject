import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Post()
    create(@Req() req, @Body() createTodoDto: CreateTodoDto) {
        return this.todosService.create(req.user._id, createTodoDto);
    }

    @Get()
    findAll(
        @Req() req,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.todosService.findAll(req.user._id, Number(page), Number(limit));
    }

    @Patch(':id')
    update(
        @Req() req,
        @Param('id') id: string,
        @Body() updateTodoDto: UpdateTodoDto
    ) {
        return this.todosService.update(id, req.user._id, updateTodoDto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.todosService.remove(id, req.user._id);
    }

    @Get('user/:userId')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async findUserTodos(
        @Param('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.todosService.findAll(userId, Number(page), Number(limit));
    }
}
