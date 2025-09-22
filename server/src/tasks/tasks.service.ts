import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    async createTask(description: string, due_date: string, assignee: User): Promise<Task> {
        const task: Task = {
            id: this.tasks.length + 1,
            description,
            due_date,
            assignee,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }

    async findAll(): Promise<Task[]> {
        return this.tasks;
    }

    async findById(id: number): Promise<Task | undefined> {
        return this.tasks.find(t => t.id === id);
    }

    async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
        const task = await this.findById(id);
        if (task) {
            Object.assign(task, updates);
        }
        return task;
    }
}
