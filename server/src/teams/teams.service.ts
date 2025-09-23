import { Injectable } from '@nestjs/common';
import { Team } from './team.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private teamsRepository: Repository<Team>,
    ) { }

    async createTeam(name: string, members: User[], description: string, createdBy: string): Promise<Team> {
        const team = this.teamsRepository.create({
            name,
            members,
            description,
            createdBy,
        });
        return this.teamsRepository.save(team);
    }

    async findAll(): Promise<Team[]> {
        return this.teamsRepository.find({ relations: ['members'] });
    }

    async findById(id: string): Promise<Team | undefined> {
        return this.teamsRepository.findOne({ where: { id }, relations: ['members'] });
    }
}