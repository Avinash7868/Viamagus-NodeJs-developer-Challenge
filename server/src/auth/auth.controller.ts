import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new UnauthorizedException('Email and password must be provided');
        }
        if (body.email === process.env.AUTH_EMAIL && body.password === process.env.AUTH_PASSWORD) {
            return this.authService.login({ username: 'admin', id: '1', email: process.env.AUTH_EMAIL });
        }
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}
