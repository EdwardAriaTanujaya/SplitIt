import { Controller, Post, Body, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express'; // Use 'import type' to avoid TS1272 errors
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // --- UPDATE: Add Response parameter to the login function ---
  @Post('login')
  async login(
    @Body() loginDto: LoginDto, 
    @Res({ passthrough: true }) response: Response // <-- NestJS trick to manipulate headers/cookies
  ) {
    // 1. Run the email/password check in the Service as usual
    const result = await this.authService.login(loginDto);

    // 2. If successful, create a JWT token and set it as an HttpOnly cookie
    const jwtSecret = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';
    const token = jwt.sign(
      { sub: result.user.id, email: result.user.email },
      jwtSecret,
      { expiresIn: '24h' } // 24-hour token validity
    );

    response.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set true in production HTTPS
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours as requested
    });

    // Optional compatibility cookie for your existing logic
    response.cookie('userId', result.user.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24, // also 24 hours
    });

    // 3. Return the result to the frontend
    return { ...result, token };
  }

  @Get('profile')
  async fetchProfile(@Req() request: Request) {
    const tokenFromCookie = request.cookies['token'];
    const authHeader = request.headers['authorization'];
    const tokenFromHeader = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      throw new UnauthorizedException('Please log in first.');
    }

    const jwtSecret = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

    let payload: any;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token. Please log in again.');
    }

    return this.authService.fetchProfile(payload.sub);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    response.clearCookie('userId');
    return { message: 'Logout successful' };
  }
}