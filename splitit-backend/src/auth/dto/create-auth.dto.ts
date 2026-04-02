import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'Name must not be empty' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email must not be empty' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password must not be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email must not be empty' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password must not be empty' })
    password: string;
}
