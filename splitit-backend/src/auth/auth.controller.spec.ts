import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

// @Controller('auth') means the base route is http://localhost:3000/auth
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route: POST http://localhost:3000/auth/register
  // @Body() takes the JSON payload sent by the frontend and maps it to RegisterDto
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    // The controller forwards the request to the service
    return this.authService.register(registerDto);
  }

  // Route: POST http://localhost:3000/auth/login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}