import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamsService } from 'src/teams';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private teamsService: TeamsService,
  ) {}

  async createTask(
    name: string,
    description: string,
    due_date: string,
    assignees: User[],
    teamId: string,
  ): Promise<Task> {
      try {
    const isMemberChecks = await Promise.all(
      assignees.map((assignee) =>
        this.teamsService.isMemberInTeam(teamId, assignee.id),
      ),
    );
    for (const isMember of isMemberChecks) {
      if (!isMember) {
        throw new Error(
          'One or more assignees are not members of the specified team.',
        );
      }
    }
    const team = await this.teamsService.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    const task = this.tasksRepository.create({
      name,
      description,
      due_date,
      assignees,
      status: TaskStatus.OPEN,
      team,
    });
    return this.tasksRepository.save(task);
      } catch (error) {
          if (error instanceof BadRequestException || error instanceof NotFoundException) {
              throw error;
          }
          throw new BadRequestException('Error creating task: ' + error?.message);
      }
  }

  async findAll(): Promise<Task[]> {
      try {
    return this.tasksRepository.find({ relations: ['assignees'] });
      } catch (error) {
          throw new Error('Error retrieving all tasks: ' + error?.message);
      }
  }

  async findById(id: string): Promise<Task | undefined> {
      try {
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['assignees'],
    });
      } catch (error) {
          throw new Error('Error finding task by ID: ' + error?.message);
      }
  }

  async updateTask(
    id: string,
    updates: Partial<Task>,
  ): Promise<Task | undefined> {
      try {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      return undefined;
    }
    Object.assign(task, updates);
    return this.tasksRepository.save(task);
      } catch (error) {
          throw new Error('Error updating task: ' + error?.message);
      }
  }
}
