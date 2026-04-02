import { Controller, Post, Body, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express'; // Use 'import type' to avoid TS1272 errors
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

    // 2. If successful, create a cookie!
    // Format: response.cookie('cookie_name', 'cookie_value', { options })
    response.cookie('userId', result.user.id, {
      httpOnly: true, // Very important! Prevents JavaScript from reading the cookie
      secure: false,  // Set to true when using HTTPS in production
      sameSite: 'none', // Required for cross-origin cookies from localhost frontend
      maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie lifetime: 7 days
    });

    // 3. Return the result to the frontend
    return result;
  }

  @Get('profile')
  async fetchProfile(@Req() request: Request) {
    const userId = request.cookies['userId'];
    if (!userId) {
      throw new UnauthorizedException('Please log in first.');
    }
    return this.authService.fetchProfile(userId);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('userId');
    return { message: 'Logout successful' };
  }
}