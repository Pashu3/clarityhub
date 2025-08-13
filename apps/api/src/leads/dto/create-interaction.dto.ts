import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInteractionDto {
  @ApiProperty({ description: 'Type of interaction (Email, Call, Meeting, etc.)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Notes about the interaction', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Outcome of the interaction', required: false })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiProperty({ description: 'When the interaction is scheduled', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledAt?: Date;

  @ApiProperty({ description: 'When the interaction was completed', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;
}