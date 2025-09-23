import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TeamsModule } from 'src/teams';

@Module({
    imports: [TypeOrmModule.forFeature([Task]),UsersModule,TeamsModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }
