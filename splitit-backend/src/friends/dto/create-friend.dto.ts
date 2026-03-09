import { IsIn, IsNotEmpty, IsString } from 'class-validator';

// Aturan saat kita mau nge-add teman (Sesuai UI Halaman 5)
export class AddFriendDto {
  @IsString()
  @IsNotEmpty({ message: 'Requester ID tidak boleh kosong' })
  requesterId: string; // ID kamu (orang yang menekan tombol Add)

  @IsString()
  @IsNotEmpty({ message: 'Nama atau Email teman tidak boleh kosong' })
  friendEmailOrName: string; // Username atau Email teman yang mau di-add
}

// Aturan saat kita merespons notifikasi (Sesuai UI Halaman 6)
export class RespondFriendDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  userId: string; // ID kamu (orang yang menerima notifikasi)

  @IsString()
  @IsNotEmpty({ message: 'Friendship ID tidak boleh kosong' })
  friendshipId: string; // ID tiket pertemanan yang mau di-Accept/Decline

  @IsString()
  @IsIn(['ACCEPTED', 'DECLINED'], { message: 'Status harus ACCEPTED atau DECLINED' })
  status: 'ACCEPTED' | 'DECLINED'; // Pilihan tombolnya
}