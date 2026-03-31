import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // FUNCTION 1: RECORD NEW EXPENSE
  async addExpense(data: CreateExpenseDto) {
    // Check whether the group actually exists
    const group = await this.prisma.group.findUnique({
      where: { id: data.groupId },
    });
    
    if (!group) {
      throw new NotFoundException('Group not found!');
    }

    // Insert the expense into the database
    const newExpense = await this.prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        groupId: data.groupId,
        payerId: data.payerId,
      },
    });

    return { message: 'Expense recorded successfully!', data: newExpense };
  }

  // FUNCTION 2: VIEW ALL EXPENSES IN A GROUP
  async getGroupExpenses(groupId: string) {
    return this.prisma.expense.findMany({
      where: { groupId: groupId },
      include: {
        payer: { select: { id: true, name: true } } // Include the name of the payer
      },
      orderBy: { createdAt: 'desc' } // Order by newest first
    });
  }
}