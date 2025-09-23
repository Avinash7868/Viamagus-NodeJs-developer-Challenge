import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { UsersModule } from '../users';
import { Team } from './team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Team]),UsersModule],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule { }
