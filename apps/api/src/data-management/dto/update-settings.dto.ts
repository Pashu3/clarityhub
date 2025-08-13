import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Backup frequency', required: false })
  @IsOptional()
  @IsString()
  backupFrequency?: string;

  @ApiProperty({ description: 'Backup time (24-hour format)', required: false })
  @IsOptional()
  @IsString()
  backupTime?: string;

  @ApiProperty({ description: 'Backup retention period in days', required: false })
  @IsOptional()
  @IsNumber()
  backupRetention?: number;

  @ApiProperty({ description: 'Backup storage location', required: false })
  @IsOptional()
  @IsString()
  backupStorage?: string;

  @ApiProperty({ description: 'Maximum export size in MB', required: false })
  @IsOptional()
  @IsNumber()
  maxExportSize?: number;

  @ApiProperty({ description: 'Export retention period in hours', required: false })
  @IsOptional()
  @IsNumber()
  exportRetention?: number;

  @ApiProperty({ description: 'Validate data before importing', required: false })
  @IsOptional()
  @IsBoolean()
  importValidation?: boolean;

  @ApiProperty({ description: 'Automatically rollback failed imports', required: false })
  @IsOptional()
  @IsBoolean()
  importRollback?: boolean;

  @ApiProperty({ description: 'Activity logs retention in days', required: false })
  @IsOptional()
  @IsNumber()
  activityLogsRetention?: number;

  @ApiProperty({ description: 'Deleted data retention in days', required: false })
  @IsOptional()
  @IsNumber()
  deletedDataRetention?: number;

  @ApiProperty({ description: 'Auto purge old data', required: false })
  @IsOptional()
  @IsBoolean()
  autoPurgeData?: boolean;

  @ApiProperty({ description: 'Analytics data retention in days', required: false })
  @IsOptional()
  @IsNumber()
  analyticsRetention?: number;

  @ApiProperty({ description: 'Connection pool size', required: false })
  @IsOptional()
  @IsNumber()
  connectionPoolSize?: number;

  @ApiProperty({ description: 'Query timeout in seconds', required: false })
  @IsOptional()
  @IsNumber()
  queryTimeout?: number;

  @ApiProperty({ description: 'Log slow database queries', required: false })
  @IsOptional()
  @IsBoolean()
  queryLogging?: boolean;

  @ApiProperty({ description: 'Maintenance window', required: false })
  @IsOptional()
  @IsString()
  maintenanceWindow?: string;

  @ApiProperty({ description: 'Encrypt sensitive data at rest', required: false })
  @IsOptional()
  @IsBoolean()
  dataEncryption?: boolean;

  @ApiProperty({ description: 'Anonymize personal data in exports', required: false })
  @IsOptional()
  @IsBoolean()
  dataAnonymization?: boolean;

  @ApiProperty({ description: 'Log all data access events', required: false })
  @IsOptional()
  @IsBoolean()
  dataAccessAuditing?: boolean;
}