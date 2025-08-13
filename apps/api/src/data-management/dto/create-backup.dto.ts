import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BackupType } from '@prisma/client';

export class CreateBackupDto {
  @ApiProperty({ description: 'Name of the backup' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: BackupType, description: 'Type of backup' })
  @IsEnum(BackupType)
  type: BackupType;

  @ApiProperty({ description: 'Retention period in days', required: false })
  @IsOptional()
  @IsNumber()
  retention?: number;

  @ApiProperty({ description: 'Specific data to backup (for partial backups)', required: false })
  @IsOptional()
  @IsString()
  dataSelection?: string; // JSON string of tables/data to include
}