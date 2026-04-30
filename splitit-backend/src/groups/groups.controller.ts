import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Route: POST http://127.0.0.1:3000/groups/expense
  @Post('expense')
  addExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.groupsService.addExpense(createExpenseDto);
  }

  // Route: POST http://127.0.0.1:3000/groups
  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(createGroupDto);
  }

  // Route: GET http://127.0.0.1:3000/groups/user/:userId
  @Get('user/:userId')
  getUserGroups(@Param('userId') userId: string) {
    return this.groupsService.getUserGroups(userId);
  }

  // Route: GET http://127.0.0.1:3000/groups/:groupId
  @Get(':groupId')
  getGroupDetail(@Param('groupId') groupId: string) {
    return this.groupsService.getGroupDetail(groupId);
  }

  // Route: DELETE http://127.0.0.1:3000/groups/:groupId/user/:userId
  @Delete(':groupId/user/:userId')
  leaveGroup(@Param('groupId') groupId: string, @Param('userId') userId: string) {
    return this.groupsService.leaveGroup(groupId, userId);
  }

  // Route: POST http://127.0.0.1:3000/groups/:groupId/members
  @Post(':groupId/members')
  addMembers(
    @Param('groupId') groupId: string,
    @Body('memberIds') memberIds: string[],
  ) {
    return this.groupsService.addMembers(groupId, memberIds);
  }
}