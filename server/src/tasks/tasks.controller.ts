import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService, private usersService: UsersService) { }

    @Post()
    async createTask(
        @Body() body: { name: string, description: string; due_date: string; assigneeIds: string[], teamId: string }
    ): Promise<Task> {
        const assignees = await Promise.all(
            body.assigneeIds.map(id => this.usersService.findById(id))
        );
        return this.tasksService.createTask(body.name, body.description, body.due_date, assignees,body.teamId);
    }

    @Get()
    async getAllTasks(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    @Patch(':id')
    async updateTask(@Param('id') id: string, @Body() updates: Partial<Task>): Promise<Task> {
        return this.tasksService.updateTask(id, updates);
    }
}