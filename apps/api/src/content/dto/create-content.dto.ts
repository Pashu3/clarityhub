import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContentType, ContentCategory, ContentStatus } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({
    description: 'Title of the content',
    example: 'How to Use the Dashboard'
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  title: string;

  @ApiProperty({
    description: 'Type of content',
    enum: ContentType,
    example: 'ARTICLE'
  })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty({
    description: 'Category of content',
    enum: ContentCategory,
    example: 'HELP'
  })
  @IsEnum(ContentCategory)
  category: ContentCategory;

  @ApiProperty({
    description: 'Status of content',
    enum: ContentStatus,
    example: 'PUBLISHED',
    required: false
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({
    description: 'Main content text/HTML',
    example: '<p>This is the main content of the article...</p>'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Brief summary of the content',
    example: 'Learn how to navigate and use the dashboard features',
    required: false
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: 'URL or path to featured image',
    example: '/uploads/content/dashboard-featured.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({
    description: 'Tags for categorizing and searching content',
    example: ['dashboard', 'tutorial', 'getting-started'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}