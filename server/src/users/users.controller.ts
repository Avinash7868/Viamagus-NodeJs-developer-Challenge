import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create.user.dto';


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

     @Post()
    async createUser(
        @Body() body: CreateUserDto
    ): Promise<User> {
        return this.usersService.createUser(body);
    }
}
