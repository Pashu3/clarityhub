import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus, TicketPriority, TicketCategory } from '@prisma/client';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Status of the ticket',
    enum: TicketStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({
    description: 'Priority of the ticket',
    enum: TicketPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({
    description: 'Category of the ticket',
    enum: TicketCategory,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @ApiProperty({
    description: 'ID of user assigned to this ticket',
    required: false
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiProperty({
    description: 'Subject of the ticket',
    required: false
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Description of the ticket',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}