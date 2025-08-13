import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketCategory, TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Subject of the support ticket',
    example: 'Cannot access analytics dashboard'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  subject: string;

  @ApiProperty({
    description: 'Detailed description of the issue',
    example: 'I\'m getting an error when trying to load the analytics dashboard: Error code 403.'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Priority of the ticket',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({
    description: 'Category of the ticket',
    enum: TicketCategory,
    default: TicketCategory.GENERAL,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @ApiProperty({
    description: 'Array of attachment IDs to associate with this ticket',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  attachmentIds?: string[];
}