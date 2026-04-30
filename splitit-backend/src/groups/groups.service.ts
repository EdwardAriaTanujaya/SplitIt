import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  // FUNCTION 1: CREATE GROUP
  async createGroup(data: CreateGroupDto) {
    // 1. Ensure the group creator exists in the database
    const creator = await this.prisma.user.findUnique({
      where: { id: data.creatorId },
    });

    if (!creator) {
      throw new NotFoundException('Creator ID not found in the database.');
    }

    // 2. Combine creator ID and other member IDs, then remove duplicates
    const rawMemberIds = data.memberIds ? [data.creatorId, ...data.memberIds] : [data.creatorId];
    const uniqueMemberIds = [...new Set(rawMemberIds)];

    // 3. Create the group and add all members to the GroupMember table
    try {
      const newGroup = await this.prisma.group.create({
        data: {
          name: data.name,
          groupImage: data.groupImage,
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

      return { message: 'Group created successfully!', data: newGroup };
    } catch (error) {
      throw new NotFoundException('One or more member IDs were not found. Make sure all friends are registered.');
    }
  }

  // FUNCTION 2: VIEW GROUP LIST (As seen in UI Pages 3 & 7)
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
        },
        members: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });
  }

  // FUNCTION 3: VIEW GROUP DETAILS (When the group is clicked)
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

    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  // FUNCTION 4: ADD EXPENSE (As seen in UI Page 8)
  async addExpense(data: CreateExpenseDto) {
    // 1. Ensure the group exists in the database
    const group = await this.prisma.group.findUnique({
      where: { id: data.groupId },
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${data.groupId} not found. Please create a group first or check the ID.`);
    }

    // 2. Ensure the payer is a member of the group
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: data.groupId, userId: data.payerId },
    });
    if (!member) {
      throw new BadRequestException(`User with ID ${data.payerId} is not a member of this group!`);
    }

    // 3. Save the expense data with per-item splits
    const expense = await this.prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        groupId: data.groupId,
        payerId: data.payerId,
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
          include: { user: { select: { id: true, name: true } } },
        },
        payer: { select: { id: true, name: true } },
      },
    });

    return { message: 'Expense added successfully!', data: expense };
  }

  // FUNCTION 5: LEAVE GROUP
  async leaveGroup(groupId: string, userId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
    });

    if (!membership) {
      throw new NotFoundException(`Membership not found for user ${userId} in group ${groupId}.`);
    }

    await this.prisma.groupMember.delete({
      where: { id: membership.id },
    });

    const remainingMembers = await this.prisma.groupMember.count({
      where: { groupId },
    });

    if (remainingMembers === 0) {
      await this.prisma.group.delete({
        where: { id: groupId },
      });
      return { message: 'Left group and deleted group because no members remain.' };
    }

    return { message: 'Left group successfully.' };
  }

  // FUNCTION 6: ADD MEMBERS TO EXISTING GROUP
  async addMembers(groupId: string, memberIds: string[]) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Filter out users who are already members
    const existingUserIds = group.members.map(m => m.userId);
    const newMemberIds = memberIds.filter(id => !existingUserIds.includes(id));

    if (newMemberIds.length === 0) {
      return { message: 'All selected users are already members of this group.' };
    }

    // Add new members
    await this.prisma.groupMember.createMany({
      data: newMemberIds.map(userId => ({
        userId,
        groupId,
      })),
    });

    return { message: `${newMemberIds.length} member(s) added successfully!` };
  }
}