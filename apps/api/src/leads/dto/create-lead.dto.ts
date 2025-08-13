import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus, LeadSource } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({ description: 'Name of the lead' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the lead' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the lead' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Message or notes about the lead', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ enum: LeadStatus, default: LeadStatus.NEW, required: false })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({ enum: LeadSource, default: LeadSource.WEBSITE, required: false })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @ApiProperty({ description: 'Estimated value of the lead', required: false })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiProperty({ description: 'Tags for categorization', type: [String], required: false })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}