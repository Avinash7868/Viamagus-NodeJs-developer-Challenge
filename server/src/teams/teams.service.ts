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
  ) {}

  async createTeam(
    name: string,
    members: User[],
    description: string,
    createdBy: string,
  ): Promise<Team> {
    try {
      const team = this.teamsRepository.create({
        name,
        members,
        description,
        createdBy,
      });
      return this.teamsRepository.save(team);
    } catch (error) {
      throw new Error('Error creating team: ' + error?.message);
    }
  }

  async findAll(): Promise<Team[]> {
    try {
      return this.teamsRepository.find({ relations: ['members'] });
    } catch (error) {
      throw new Error('Error retrieving all teams: ' + error?.message);
    }
  }

  async findByCreatorId(creatorId: string): Promise<Team[]> {
    try {
      return this.teamsRepository.find({
        where: { createdBy: creatorId },
        relations: ['members'],
      });
    } catch (error) {
      throw new Error('Error retrieving teams by creator: ' + error?.message);
    }
  }

  async findById(id: string): Promise<Team | undefined> {
    try {
      return this.teamsRepository.findOne({
        where: { id },
        relations: ['members'],
      });
    } catch (error) {
      throw new Error('Error finding team by ID: ' + error?.message);
    }
  }

  async isMemberInTeam(teamId: string, memberId: string): Promise<boolean> {
    const team = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoin('team.members', 'member')
      .where('team.id = :teamId', { teamId })
      .andWhere('member.id = :memberId', { memberId })
      .getOne();
    return !!team;
  }

    async updateTeamMembers(
        teamId: string,
        users: User[],
    ): Promise<Team | undefined> {
        try {
            const team = await this.teamsRepository.findOne({
                where: { id: teamId },
                relations: ['members'],
            });
        if (!team) throw new Error('Team not found');

        // logic to add new members without duplicating existing ones
        const existingIds = team.members.map(u => u.id);
        const newMembers = users.filter(u => !existingIds.includes(u.id));
        team.members = [...team.members, ...newMembers];

        return this.teamsRepository.save(team);
    } catch (error) {
        throw new Error('Error finding team by ID: ' + error?.message);
    }
}
}
