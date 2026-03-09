import { Controller, Post, Body, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express'; // Gunakan 'import type' untuk menghindari error TS1272
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // --- UPDATE: Tambahkan parameter Response (Res) di fungsi Login ---
  @Post('login')
  async login(
    @Body() loginDto: LoginDto, 
    @Res({ passthrough: true }) response: Response // <-- Trik NestJS untuk memanipulasi header/cookie
  ) {
    // 1. Jalankan proses cek email & password di Service seperti biasa
    const result = await this.authService.login(loginDto);

    // 2. Kalau sukses, buatkan Cookie!
    // Format: response.cookie('nama_cookie', 'isi_cookie', { aturan })
    response.cookie('userId', result.user.id, {
      httpOnly: true, // Sangat penting! Mencegah hacker mencuri cookie pakai JavaScript
      secure: false,  // Set ke 'true' kalau nanti aplikasimu udah pakai HTTPS (Production)
      sameSite: 'lax', // Biar aman kalau di browser modern
      maxAge: 1000 * 60 * 60 * 24 * 7, // Umur cookie: 7 Hari (dalam milidetik)
    });

    // 3. Kembalikan data aslinya ke frontend
    return result;
  }

  @Get('profile')
  async fetchProfile(@Req() request: Request) {
    const userId = request.cookies['userId'];
    if (!userId) {
      throw new UnauthorizedException('Silakan login terlebih dahulu.');
    }
    return this.authService.fetchProfile(userId);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('userId');
    return { message: 'Berhasil logout' };
  }
}