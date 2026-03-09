import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddFriendDto, RespondFriendDto } from './dto/create-friend.dto';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  // FUNGSI 1: KIRIM PERMINTAAN PERTEMANAN (Add Friend)
  async sendFriendRequest(data: AddFriendDto) {
    // 0. Cek apakah pengirim (kamu) terdaftar di DB
    const requester = await this.prisma.user.findUnique({
      where: { id: data.requesterId },
    });

    if (!requester) {
      throw new NotFoundException('ID Pengirim (kamu) tidak ditemukan di database. Silakan login ulang.');
    }

    // 1. Cari user tujuan berdasarkan nama atau email
    const targetUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.friendEmailOrName },
          { name: data.friendEmailOrName },
        ],
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User tidak ditemukan!');
    }

    if (targetUser.id === data.requesterId) {
      throw new BadRequestException('Kamu tidak bisa menambahkan dirimu sendiri.');
    }

    // Cek apakah mereka sudah pernah berteman atau request sudah ada
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: data.requesterId, friendId: targetUser.id },
          { userId: targetUser.id, friendId: data.requesterId },
        ],
      },
    });

    if (existingFriendship) {
      throw new BadRequestException('Permintaan pertemanan sudah ada atau kalian sudah berteman.');
    }

    // Buat data pertemanan baru dengan status PENDING
    const newRequest = await this.prisma.friendship.create({
      data: {
        userId: data.requesterId,
        friendId: targetUser.id,
        status: 'PENDING',
      },
    });

    return { message: 'Permintaan pertemanan berhasil dikirim!', data: newRequest };
  }

  // FUNGSI 2: CEK NOTIFIKASI (Melihat siapa saja yang nge-add kita)
  async getPendingRequests(userId: string) {
    // Cari data di mana kita adalah 'friendId' dan statusnya masih PENDING
    return this.prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, name: true, email: true } }, // Bawa data nama orang yang nge-add
      },
    });
  }

  // FUNGSI 3: TERIMA ATAU TOLAK (Accept / Decline)
  async respondToRequest(data: RespondFriendDto) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: data.friendshipId },
    });

    if (!friendship || friendship.friendId !== data.userId) {
      throw new NotFoundException('Permintaan pertemanan tidak valid.');
    }

    if (data.status === 'DECLINED') {
      // Kalau ditolak, kita hapus saja datanya dari database
      await this.prisma.friendship.delete({
        where: { id: data.friendshipId },
      });
      return { message: 'Permintaan pertemanan ditolak.' };
    }

    // Kalau diterima (ACCEPTED), kita update statusnya
    const updatedFriendship = await this.prisma.friendship.update({
      where: { id: data.friendshipId },
      data: { status: 'ACCEPTED' },
    });

    return { message: 'Permintaan pertemanan diterima!', data: updatedFriendship };
  }
}