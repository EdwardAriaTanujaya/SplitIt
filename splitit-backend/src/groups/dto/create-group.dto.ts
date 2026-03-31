import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty({ message: 'Group name must not be empty' })
  name: string; // Group name (e.g. "KFC Party")

  @IsString()
  @IsNotEmpty({ message: 'Creator ID must not be empty' })
  creatorId: string; // Your ID (the group creator)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  memberIds?: string[]; // (Optional) Array of friend IDs to add immediately

  @IsOptional()
  @IsString()
  groupImage?: string; // (Optional) Path / icon for the group category
}