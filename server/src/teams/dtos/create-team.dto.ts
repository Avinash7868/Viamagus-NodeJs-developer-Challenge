import { IsString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    name: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    memberIds: number[];
}
