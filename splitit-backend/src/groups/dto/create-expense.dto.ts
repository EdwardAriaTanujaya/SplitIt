import { IsNotEmpty, IsNumber, IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty({ message: 'Expense title must not be empty' })
  title: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsUUID('4', { message: 'Group ID must be a valid UUID' })
  groupId: string;

  @IsUUID('4', { message: 'Payer ID must be a valid UUID' })
  payerId: string;

  @IsOptional()
  @IsArray()
  splits?: {
    userId: string;
    amount: number;
    description?: string;
  }[];
}