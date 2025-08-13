import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContentCategory, ContentStatus } from '@prisma/client';

export class UpdateFaqDto {
  @ApiProperty({
    description: 'The question text',
    example: 'Updated: How do I reset my password?',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(5, 200)
  question?: string;

  @ApiProperty({
    description: 'The answer text',
    example: 'To reset your password, follow these updated steps...',
    required: false
  })
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiProperty({
    description: 'Category of the FAQ',
    enum: ContentCategory,
    example: 'ACCOUNT',
    required: false
  })
  @IsOptional()
  @IsEnum(ContentCategory)
  category?: ContentCategory;

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
  contentId?: string;
}