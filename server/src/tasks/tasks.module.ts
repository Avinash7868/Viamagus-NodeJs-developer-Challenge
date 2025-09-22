import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }
