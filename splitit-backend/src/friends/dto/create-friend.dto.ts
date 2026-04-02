import { IsIn, IsNotEmpty, IsString } from 'class-validator';

// Rules for sending a friend request (UI page flow)
export class AddFriendDto {
  @IsString()
  @IsNotEmpty({ message: 'Requester ID cannot be empty' })
  requesterId: string; // Your ID (the user clicking Add)

  @IsString()
  @IsNotEmpty({ message: 'Friend name or email cannot be empty' })
  friendEmailOrName: string; // The username or email of the friend to add
}

// Rules for responding to notifications
export class RespondFriendDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  userId: string; // Your ID (the user receiving the notification)

  @IsString()
  @IsNotEmpty({ message: 'Friendship ID cannot be empty' })
  friendshipId: string; // The friend request ticket ID to accept/decline

  @IsString()
  @IsIn(['ACCEPTED', 'DECLINED'], { message: 'Status must be ACCEPTED or DECLINED' })
  status: 'ACCEPTED' | 'DECLINED'; // The selected action button
}