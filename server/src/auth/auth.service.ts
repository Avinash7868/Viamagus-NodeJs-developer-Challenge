import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        try {
            if (!email || !pass) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const user = await this.usersService.findByEmail(email);
            if (user) {
                const isPasswordValid = await bcrypt.compare(pass, user.password);
                if (isPasswordValid) {
                    const { password, ...result } = user;
                    return result;
                } else {
                    throw new UnauthorizedException('Invalid credentials');
                }
            } else {
                throw new UnauthorizedException('Invalid credentials');
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
