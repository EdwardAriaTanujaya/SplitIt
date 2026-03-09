import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  // FUNGSI 1: BIKIN GRUP BARU
  async createGroup(data: CreateGroupDto) {
    // 1. Pastikan pembuat grup (Creator) ada di database
    const creator = await this.prisma.user.findUnique({
      where: { id: data.creatorId },
    });

    if (!creator) {
      throw new NotFoundException('ID Pembuat (Creator) tidak ditemukan di database.');
    }

    // 2. Gabungkan ID pembuat dan member lain, lalu hapus ID yang duplikat
    const rawMemberIds = data.memberIds ? [data.creatorId, ...data.memberIds] : [data.creatorId];
    const uniqueMemberIds = [...new Set(rawMemberIds)];

    // 3. Bikin grup sekaligus menambahkan semua anggotanya ke tabel GroupMember
    try {
      const newGroup = await this.prisma.group.create({
        data: {
          name: data.name,
          members: {
            create: uniqueMemberIds.map(id => ({
              userId: id
            }))
          }
        },
        include: {
          members: {
            include: {
              user: { select: { name: true } }
            }
          }
        }
      });

      return { message: 'Grup berhasil dibuat!', data: newGroup };
    } catch (error) {
      throw new NotFoundException('Salah satu ID member tidak ditemukan. Pastikan semua teman sudah register.');
    }
  }

  // FUNGSI 2: LIHAT DAFTAR GRUP (Sesuai UI Halaman 3 & 7)
  async getUserGroups(userId: string) {
    return this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });
  }

  // FUNGSI 3: LIHAT DETAIL GRUP (Saat grupnya di-klik)
  async getGroupDetail(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        expenses: true
      }
    });

    if (!group) throw new NotFoundException('Grup tidak ditemukan');
    return group;
  }

  // FUNGSI 4: TAMBAHKAN PENGELUARAN (Sesuai UI Halaman 8)
  async addExpense(data: CreateExpenseDto) {
    // 1. Pastikan grup ada di database
    const group = await this.prisma.group.findUnique({
      where: { id: data.groupId },
    });
    if (!group) {
      throw new NotFoundException(`Grup dengan ID ${data.groupId} tidak ditemukan. Silakan buat grup baru atau cek ID-nya.`);
    }

    // 2. Pastikan orang yang bayar (payer) adalah anggota grup
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: data.groupId, userId: data.payerId },
    });
    if (!member) {
      throw new BadRequestException(`User dengan ID ${data.payerId} bukan anggota dari grup ini!`);
    }

    // 3. Simpan data pengeluaran
    const expense = await this.prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        groupId: data.groupId,
        payerId: data.payerId,
      },
    });

    return { message: 'Tagihan berhasil ditambahkan!', data: expense };
  }
}