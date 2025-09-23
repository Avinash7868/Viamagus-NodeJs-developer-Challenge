import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error('Error finding user by username: ' + error?.message);
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      return this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Error finding user by ID: ' + error?.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw new Error('Error retrieving all users: ' + error?.message);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      userData.password = await bcrypt.hash(userData.password, 10);
      const user = this.usersRepository.create(userData);
      let data = await this.usersRepository.save(user);
      if (data && data?.password) {
        delete data.password;
      }
      return data;
    } catch (error) {
      throw new Error('Error creating user: ' + error?.message);
    }
  }
}
