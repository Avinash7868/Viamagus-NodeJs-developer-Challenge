import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule { }
