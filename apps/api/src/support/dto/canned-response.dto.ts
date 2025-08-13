import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CannedResponseDto {
  @ApiProperty({
    description: 'Title of the canned response',
    example: 'Welcome Message'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the canned response',
    example: 'Hello! Thank you for contacting ClarityHub support. How can I assist you today?'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Category of the canned response',
    example: 'LIVE_CHAT',
    required: false
  })
  @IsOptional()
  @IsString()
  category?: string;
}