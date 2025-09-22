import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService, private usersService: UsersService) { }

    @Post()
    async createTask(@Body() body: { description: string; due_date: string; assigneeId: number }): Promise<Task> {
        const assignee = await this.usersService.findById(body.assigneeId);
        return this.tasksService.createTask(body.description, body.due_date, assignee);
    }

    @Get()
    async getAllTasks(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    @Patch(':id')
    async updateTask(@Param('id') id: number, @Body() updates: Partial<Task>): Promise<Task> {
        return this.tasksService.updateTask(id, updates);
    }
}
