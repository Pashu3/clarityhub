import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSharedChatDto {
  @ApiProperty({ description: 'ID of the AI query to share' })
  @IsNotEmpty()
  @IsUUID()
  aiQueryId: string;

  @ApiProperty({ description: 'Title of the shared chat' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Preview text for the shared chat' })
  @IsNotEmpty()
  @IsString()
  previewText: string;

  @ApiProperty({ description: 'Array of user IDs to share with' })
  @IsArray()
  @IsString({ each: true })
  sharedWithUserIds: string[];
}