import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversation/:userId/:friendId')
  getConversation(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.messagesService.getConversation(userId, friendId);
  }

  @Post('send')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(sendMessageDto);
  }
}
