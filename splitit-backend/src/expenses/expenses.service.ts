import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // FUNGSI 1: CATAT TAGIHAN BARU
  async addExpense(data: CreateExpenseDto) {
    // Cek dulu apakah grupnya beneran ada
    const group = await this.prisma.group.findUnique({
      where: { id: data.groupId },
    });
    
    if (!group) {
      throw new NotFoundException('Grup tidak ditemukan!');
    }

    // Masukkan data tagihan ke database
    const newExpense = await this.prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        groupId: data.groupId,
        payerId: data.payerId,
      },
    });

    return { message: 'Tagihan berhasil dicatat!', data: newExpense };
  }

  // FUNGSI 2: LIHAT SEMUA TAGIHAN DI SATU GRUP
  async getGroupExpenses(groupId: string) {
    return this.prisma.expense.findMany({
      where: { groupId: groupId },
      include: {
        payer: { select: { id: true, name: true } } // Bawa data nama yang nalangin
      },
      orderBy: { createdAt: 'desc' } // Urutkan dari tagihan paling baru
    });
  }
}