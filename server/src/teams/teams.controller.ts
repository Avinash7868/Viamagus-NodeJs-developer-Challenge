import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './team.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
    constructor(private teamsService: TeamsService, private usersService: UsersService) { }

    @Post()
    async createTeam(@Body() body: { name: string; memberIds: string[], description: string }, @Req() req: any): Promise<Team> {
        const userId = req.userId;
        const members = await Promise.all(body.memberIds.map(id => this.usersService.findById(id)));
        return this.teamsService.createTeam(body.name, members, body.description, userId);
    }

    @Get()
    async getAllTeams(): Promise<Team[]> {
        return this.teamsService.findAll();
    }
}
