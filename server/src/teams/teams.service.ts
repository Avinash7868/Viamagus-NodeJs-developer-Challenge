import { Injectable } from '@nestjs/common';
import { Team } from './team.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TeamsService {
    private teams: Team[] = [];

    async createTeam(name: string, members: User[]): Promise<Team> {
        const team: Team = {
            id: this.teams.length + 1,
            name,
            members,
        };
        this.teams.push(team);
        return team;
    }

    async findAll(): Promise<Team[]> {
        return this.teams;
    }

    async findById(id: number): Promise<Team | undefined> {
        return this.teams.find(t => t.id === id);
    }
}
