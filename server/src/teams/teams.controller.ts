import { Controller, Post, Get, Body, UseGuards, Req, Patch, Param } from '@nestjs/common';
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
        const userId = req?.user?.userId;
        const members = await Promise.all(body.memberIds.map(id => this.usersService.findById(id)));
        return this.teamsService.createTeam(body.name, members, body.description, userId);
    }

    @Get()
    async getAllTeams(): Promise<Team[]> {
        return this.teamsService.findAll();
    }

    @Get('creator/')
    async getTeamsByCreator(@Req() req:any): Promise<Team[]> {
        const creatorId = req?.user?.userId;
        return this.teamsService.findByCreatorId(creatorId);
    }

    @Patch(':id/members')
    async updateTeamMembers(
        @Param('id') id: string,
        @Body() body: { memberIds: string[] }
    ): Promise<Team> {
        const users = await Promise.all(body.memberIds.map(uid => this.usersService.findById(uid)));
        return this.teamsService.updateTeamMembers(id, users);
    }
}
