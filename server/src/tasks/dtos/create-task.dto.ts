import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    description: string;

    @IsDateString()
    due_date: string;

    @IsInt()
    assigneeId: number;
}
