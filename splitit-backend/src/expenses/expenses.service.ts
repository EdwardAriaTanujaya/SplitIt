import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // FUNCTION 1: RECORD NEW EXPENSE WITH PER-ITEM SPLITS
  async addExpense(data: CreateExpenseDto) {
    // Check whether the group actually exists
    const group = await this.prisma.group.findUnique({
      where: { id: data.groupId },
    });
    
    if (!group) {
      throw new NotFoundException('Group not found!');
    }

    // Create expense + splits in a single transaction
    const newExpense = await this.prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        groupId: data.groupId,
        payerId: data.payerId,
        // Create per-person splits if provided
        ...(data.splits && data.splits.length > 0
          ? {
              splits: {
                create: data.splits.map((split) => ({
                  userId: split.userId,
                  amount: split.amount,
                  description: split.description || null,
                })),
              },
            }
          : {}),
      },
      include: {
        splits: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        payer: { select: { id: true, name: true } },
      },
    });

    return { message: 'Expense recorded successfully!', data: newExpense };
  }

  // FUNCTION 2: VIEW ALL EXPENSES IN A GROUP (with splits)
  async getGroupExpenses(groupId: string) {
    return this.prisma.expense.findMany({
      where: { groupId: groupId },
      include: {
        payer: { select: { id: true, name: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}