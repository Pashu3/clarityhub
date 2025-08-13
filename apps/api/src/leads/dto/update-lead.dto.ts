import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus, LeadSource } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateLeadDto {
  @ApiProperty({ description: 'Name of the lead', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email address of the lead', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the lead', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Message or notes about the lead', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ enum: LeadStatus, required: false })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({ enum: LeadSource, required: false })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @ApiProperty({ description: 'Estimated value of the lead', required: false })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiProperty({ description: 'Last contact date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastContactAt?: Date;

  @ApiProperty({ description: 'Notes about the lead', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Tags for categorization', type: [String], required: false })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}