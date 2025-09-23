import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Task]),UsersModule],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }
