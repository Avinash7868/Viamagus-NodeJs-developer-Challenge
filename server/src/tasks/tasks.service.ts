import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    async createTask(name: string, description: string, due_date: string, assignee: User): Promise<Task> {
        const task = this.tasksRepository.create({
            name,
            description,
            due_date,
            assignee,
            status: TaskStatus.OPEN,
        });
        return this.tasksRepository.save(task);
    }

    async findAll(): Promise<Task[]> {
        return this.tasksRepository.find({ relations: ['assignee'] });
    }

    async findById(id: string): Promise<Task | undefined> {
        return this.tasksRepository.findOne({ where: { id }, relations: ['assignee'] });
    }

    async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
        const task = await this.tasksRepository.findOne({ where: { id } });
        if (!task) {
            return undefined;
        }
        Object.assign(task, updates);
        return this.tasksRepository.save(task);
    }
}