import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { UsersModule } from '../users';
import { Team } from './team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Team]),UsersModule],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule { }
