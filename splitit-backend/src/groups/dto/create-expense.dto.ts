import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul pengeluaran tidak boleh kosong' })
  title: string;

  @IsNumber({}, { message: 'Jumlah harus berupa angka' })
  amount: number;

  @IsUUID('4', { message: 'Group ID harus berupa UUID yang valid' })
  groupId: string;

  @IsUUID('4', { message: 'Payer ID harus berupa UUID yang valid' })
  payerId: string;
}