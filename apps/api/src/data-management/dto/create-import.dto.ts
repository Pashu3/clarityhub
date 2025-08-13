import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType } from '@prisma/client';

export class CreateImportDto {
  @ApiProperty({ description: 'Name of the import' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: DataType, description: 'Type of data being imported' })
  @IsEnum(DataType)
  dataType: DataType;

  @ApiProperty({ description: 'Whether to validate the data before importing' })
  @IsOptional()
  @IsBoolean()
  validateOnly?: boolean;

  @ApiProperty({ description: 'Whether to update existing records if found' })
  @IsOptional()
  @IsBoolean()
  updateExisting?: boolean;
}