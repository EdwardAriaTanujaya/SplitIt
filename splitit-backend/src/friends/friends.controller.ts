import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AddFriendDto, RespondFriendDto } from './dto/create-friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // Rute: POST http://127.0.0.1:3000/friends/request
  @Post('request')
  sendFriendRequest(@Body() addFriendDto: AddFriendDto) {
    return this.friendsService.sendFriendRequest(addFriendDto);
  }

  // Rute: GET http://127.0.0.1:3000/friends/pending/:userId
  @Get('pending/:userId')
  getPendingRequests(@Param('userId') userId: string) {
    return this.friendsService.getPendingRequests(userId);
  }

  // Rute: PATCH http://127.0.0.1:3000/friends/respond
  @Patch('respond')
  respondToRequest(@Body() respondFriendDto: RespondFriendDto) {
    return this.friendsService.respondToRequest(respondFriendDto);
  }
}
