import { IsBoolean, IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TicketResponseDto {
  @ApiProperty({
    description: 'Content of the response',
    example: 'I\'ve checked your account and you need to update your permissions.'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Whether this is an internal note (not visible to customer)',
    default: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;

  @ApiProperty({
    description: 'Array of attachment IDs to associate with this response',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  attachmentIds?: string[];
}