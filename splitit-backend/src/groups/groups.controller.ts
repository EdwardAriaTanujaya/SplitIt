import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Rute: POST http://127.0.0.1:3000/groups/expense
  @Post('expense')
  addExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.groupsService.addExpense(createExpenseDto);
  }

  // Rute: POST http://127.0.0.1:3000/groups
  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(createGroupDto);
  }

  // Rute: GET http://127.0.0.1:3000/groups/user/:userId
  @Get('user/:userId')
  getUserGroups(@Param('userId') userId: string) {
    return this.groupsService.getUserGroups(userId);
  }

  // Rute: GET http://127.0.0.1:3000/groups/:groupId
  @Get(':groupId')
  getGroupDetail(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupDetail(groupId);
  }
}