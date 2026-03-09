import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Memanggil koneksi database kita
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  // Dependency Injection: Kita memasukkan PrismaService agar si Koki (Service) bisa akses Database
  constructor(private prisma: PrismaService) {}

  // FUNGSI 1: REGISTER
  async register(data: RegisterDto) {
    // 1. Cek apakah email sudah pernah didaftarkan sebelumnya
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar, silakan gunakan email lain.');
    }

    // 2. Acak password menggunakan bcrypt (Salt rounds = 10, standar keamanan yang baik)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Simpan data user baru ke database PostgreSQL via Prisma
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, // Simpan password yang sudah diacak!
      },
    });

    // 4. Kembalikan data user ke frontend, TAPI password-nya kita buang biar aman
    const { password, ...result } = newUser;
    return result;
  }

  // FUNGSI 2: LOGIN
  async login(data: LoginDto) {
    // 1. Cari user di database berdasarkan email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // 2. Jika email tidak ditemukan
    if (!user) {
      throw new UnauthorizedException('Email atau password salah!');
    }

    // 3. Cocokkan password dari frontend dengan password acak di database
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah!');
    }

    // 4. Jika berhasil, kembalikan data user (tanpa password)
    const { password, ...result } = user;
    return {
      message: 'Login berhasil!',
      user: result,
    };
  }

  // FUNGSI 3: LIHAT PROFIL (Berdasarkan ID dari Cookie)
  async fetchProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan atau silakan login ulang.');
    }

    const { password, ...result } = user;
    return { user: result };
  }
}