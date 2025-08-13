import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType, DataExportFormat } from '@prisma/client';

export class CreateExportDto {
  @ApiProperty({ description: 'Name of the export' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: DataType, description: 'Type of data to export' })
  @IsEnum(DataType)
  dataType: DataType;

  @ApiProperty({ enum: DataExportFormat, description: 'Format of the export file' })
  @IsEnum(DataExportFormat)
  format: DataExportFormat;

  @ApiProperty({ description: 'Optional filters to apply to the data export', required: false })
  @IsOptional()
  @IsString()
  filters?: string; // JSON string with filters

  @ApiProperty({ description: 'Fields to include in the export', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  fields?: string[];
}