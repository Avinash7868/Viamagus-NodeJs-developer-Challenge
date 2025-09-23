import { Injectable } from '@nestjs/common';
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
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['assignees'] });
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['assignees'],
    });
  }

  async updateTask(
    id: string,
    updates: Partial<Task>,
  ): Promise<Task | undefined> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      return undefined;
    }
    Object.assign(task, updates);
    return this.tasksRepository.save(task);
  }
}
