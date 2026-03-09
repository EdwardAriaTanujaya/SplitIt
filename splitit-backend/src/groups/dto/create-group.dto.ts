import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama grup tidak boleh kosong' })
  name: string; // Nama grup (Contoh: "KFC Party")

  @IsString()
  @IsNotEmpty({ message: 'Creator ID tidak boleh kosong' })
  creatorId: string; // ID kamu (orang yang bikin grup)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  memberIds?: string[]; // (Opsional) Array ID teman-teman yang mau langsung dimasukkan
}