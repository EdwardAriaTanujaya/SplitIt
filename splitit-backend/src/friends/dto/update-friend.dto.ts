import { PartialType } from '@nestjs/mapped-types';
import { AddFriendDto } from './create-friend.dto';

export class UpdateFriendDto extends PartialType(AddFriendDto) {}