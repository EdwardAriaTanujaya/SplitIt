import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

// @Controller('auth') artinya rute utamanya adalah http://localhost:3000/auth
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rute: POST http://localhost:3000/auth/register
  // @Body() mengambil data JSON yang dikirim oleh frontend dan mencocokkannya dengan RegisterDto
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    // Pelayan menyerahkan pesanan ke koki (Service)
    return this.authService.register(registerDto);
  }

  // Rute: POST http://localhost:3000/auth/login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}