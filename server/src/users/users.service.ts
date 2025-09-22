import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    private users: User[] = [
        {
            id: 1,
            username: 'admin',
            password: bcrypt.hashSync('password', 10),
            name: 'Admin User',
            email: 'admin@example.com',
        },
        {
            id: 2,
            username: 'john',
            password: bcrypt.hashSync('john123', 10),
            name: 'John Doe',
            email: 'john@example.com',
        },
    ];

    async findByUsername(username: string): Promise<User | undefined> {
        return this.users.find(u => u.username === username);
    }

    async findById(id: number): Promise<User | undefined> {
        return this.users.find(u => u.id === id);
    }

    async findAll(): Promise<User[]> {
        return this.users;
    }
}
