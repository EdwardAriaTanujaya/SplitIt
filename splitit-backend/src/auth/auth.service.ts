import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import our database connection
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  // Dependency Injection: Inject PrismaService so this service can access the database
  constructor(private prisma: PrismaService) {}

  // FUNCTION 1: REGISTER
  async register(data: RegisterDto) {
    // 1. Check whether the email has already been registered
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email has been used, please use another email!');
    }

    // 2. Hash the password using bcrypt (Salt rounds = 10, good security standard)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Save the new user data to the PostgreSQL database via Prisma
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, // Simpan password yang sudah diacak!
      },
    });

    // 4. Return user data to the frontend, but exclude the password for safety
    const { password, ...result } = newUser;
    return result;
  }

  // FUNCTION 2: LOGIN
  async login(data: LoginDto) {
    // 1. Find the user in the database by email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // 2. If the user is not found
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect!');
    }

    // 3. Compare the password from the frontend with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect!');
    }

    // 4. If successful, return user data (without password)
    const { password, ...result } = user;
    return {
      message: 'Successfully logged in!',
      user: result,
    };
  }

  // FUNCTION 3: FETCH PROFILE (Based on ID from Cookie)
  async fetchProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please log in again.');
    }

    const { password, ...result } = user;
    return { user: result };
  }
}