import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Sender ID is required.' })
  senderId: string;

  @IsString()
  @IsNotEmpty({ message: 'Receiver ID is required.' })
  receiverId: string;

  @IsString()
  @IsNotEmpty({ message: 'Message content is required.' })
  @Length(1, 1000, { message: 'Message must be between 1 and 1000 characters.' })
  content: string;
}
