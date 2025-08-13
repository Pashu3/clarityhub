import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContentCategory, ContentStatus } from '@prisma/client';

export class CreateFaqDto {
  @ApiProperty({
    description: 'The question text',
    example: 'How do I reset my password?'
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  question: string;

  @ApiProperty({
    description: 'The answer text',
    example: 'To reset your password, click on the "Forgot Password" link on the login page...'
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
    description: 'Category of the FAQ',
    enum: ContentCategory,
    example: 'ACCOUNT'
  })
  @IsEnum(ContentCategory)
  category: ContentCategory;

  @ApiProperty({
    description: 'Status of the FAQ',
    enum: ContentStatus,
    example: 'PUBLISHED',
    required: false
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({
    description: 'Related content ID (if this FAQ is related to specific documentation)',
    example: '5f8d43e1-3f53-4b67-a456-789012345678',
    required: false
  })
  @IsOptional()
  @IsString()
  contentId?: string; // Optional relation to documentation
}