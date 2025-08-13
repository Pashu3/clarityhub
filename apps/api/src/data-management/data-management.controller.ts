import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Patch,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { 
  Role, 
  DataType, 
  DataExportFormat, 
  DataOperationStatus, 
  BackupType 
} from '@prisma/client';
import { DataManagementService } from './data-management.service';
import {
  CreateExportDto,
  CreateImportDto,
  CreateBackupDto,
  UpdateSettingsDto,
} from './dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
  
  @ApiTags('Data Management')
  @ApiBearerAuth()
  @Controller('data-management')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  export class DataManagementController {
    constructor(private readonly dataManagementService: DataManagementService) {}
  
    // Dashboard/Overview
    @Get('dashboard')
    @ApiOperation({ summary: 'Get data management dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
    async getDashboard() {
      return this.dataManagementService.getDashboardStats();
    }
  
    @Get('activity')
    @ApiOperation({ summary: 'Get recent data management activity' })
    @ApiQuery({ name: 'type', required: false, description: 'Filter by activity type' })
    @ApiResponse({ status: 200, description: 'Returns recent activity' })
    async getRecentActivity(@Query('type') type?: string) {
      return this.dataManagementService.getRecentActivity(type);
    }
  
    // Export methods
    @Post('exports')
    @ApiOperation({ summary: 'Create a new data export' })
    @ApiResponse({ status: 201, description: 'Export job created successfully' })
    async createExport(@Body() dto: CreateExportDto, @Req() req) {
      return this.dataManagementService.createExport(dto, req.user.sub);
    }
  
    @Get('exports')
    @ApiOperation({ summary: 'Get list of exports' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of records to skip' })
    @ApiQuery({ name: 'dataType', required: false, enum: DataType, description: 'Filter by data type' })
    @ApiQuery({ name: 'format', required: false, enum: DataExportFormat, description: 'Filter by format' })
    @ApiQuery({ name: 'status', required: false, enum: DataOperationStatus, description: 'Filter by status' })
    @ApiQuery({ name: 'search', required: false, description: 'Search in name' })
    @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter by date from (ISO format)' })
    @ApiQuery({ name: 'dateTo', required: false, description: 'Filter by date to (ISO format)' })
    @ApiResponse({ status: 200, description: 'Returns list of exports' })
    async getExports(
      @Req() req,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
      @Query('dataType') dataType?: DataType,
      @Query('format') format?: string,
      @Query('status') status?: DataOperationStatus,
      @Query('search') search?: string,
      @Query('dateFrom') dateFrom?: string,
      @Query('dateTo') dateTo?: string,
    ) {
      // For admin, show all exports; for non-admin, show only their exports
      const userId = req.user.role === Role.SUPERADMIN ? undefined : req.user.sub;
      
      // Build filters
      const filters: any = {};
      if (dataType) filters.dataType = dataType;
      if (format) filters.format = format;
      if (status) filters.status = status;
      if (search) filters.search = search;
      if (dateFrom) filters.dateFrom = new Date(dateFrom);
      if (dateTo) filters.dateTo = new Date(dateTo);
      
      return this.dataManagementService.getExports(limit, offset, userId, filters);
    }
  
    @Get('exports/:id')
    @ApiOperation({ summary: 'Get export details' })
    @ApiParam({ name: 'id', description: 'Export ID' })
    @ApiResponse({ status: 200, description: 'Returns export details' })
    @ApiResponse({ status: 404, description: 'Export not found' })
    async getExport(@Param('id') id: string) {
      return this.dataManagementService.getExport(id);
    }
  
    @Get('exports/:id/download')
    @ApiOperation({ summary: 'Download export file' })
    @ApiParam({ name: 'id', description: 'Export ID' })
    @ApiResponse({ status: 200, description: 'File download' })
    @ApiResponse({ status: 404, description: 'Export file not found' })
    async downloadExport(@Param('id') id: string, @Res() res: Response) {
      const { filePath, fileName } = await this.dataManagementService.downloadExport(id);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  
    // Import methods
    @Post('imports')
@ApiOperation({ summary: 'Upload and create a new data import' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'File to upload (CSV, XLSX, or JSON)',
      },
      name: {
        type: 'string',
        description: 'Name of the import',
      },
      dataType: {
        type: 'string',
        enum: Object.values(DataType),
        description: 'Type of data being imported',
      },
      validateOnly: {
        type: 'boolean',
        description: 'Whether to validate only (true) or import data (false)',
      },
      updateExisting: {
        type: 'boolean',
        description: 'Whether to update existing records if found',
      },
    },
    required: ['file', 'name', 'dataType'],
  },
})
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './data/imports',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
    },
    fileFilter: (req, file, callback) => {
      const ext = extname(file.originalname).toLowerCase();
      if (!['.csv', '.xlsx', '.json'].includes(ext)) {
        return callback(new Error('Only CSV, XLSX, and JSON files are allowed'), false);
      }
      callback(null, true);
    },
  }),
)
@ApiResponse({ status: 201, description: 'Import job created successfully' })
@ApiResponse({ status: 400, description: 'Invalid file format or missing required fields' })
async createImport(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateImportDto,
  @Req() req,
) {
  return this.dataManagementService.createImport(dto, file, req.user.sub);
}
  
    @Get('imports')
@ApiOperation({ summary: 'Get list of imports' })
@ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
@ApiQuery({ name: 'offset', required: false, description: 'Number of records to skip' })
@ApiQuery({ name: 'dataType', required: false, enum: DataType, description: 'Filter by data type' })
@ApiQuery({ name: 'format', required: false, enum: DataExportFormat, description: 'Filter by format' })
@ApiQuery({ name: 'status', required: false, enum: DataOperationStatus, description: 'Filter by status' })
@ApiQuery({ name: 'search', required: false, description: 'Search in name' })
@ApiQuery({ name: 'dateFrom', required: false, description: 'Filter by date from (ISO format)' })
@ApiQuery({ name: 'dateTo', required: false, description: 'Filter by date to (ISO format)' })
@ApiQuery({ name: 'hasErrors', required: false, type: Boolean, description: 'Filter by whether the import has errors' })
@ApiResponse({ status: 200, description: 'Returns list of imports' })
async getImports(
  @Req() req,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  @Query('dataType') dataType?: DataType,
  @Query('format') format?: string,
  @Query('status') status?: DataOperationStatus,
  @Query('search') search?: string,
  @Query('dateFrom') dateFrom?: string,
  @Query('dateTo') dateTo?: string,
  @Query('hasErrors', new ParseBoolPipe({ optional: true })) hasErrors?: boolean,
) {
  // For admin, show all imports; for non-admin, show only their imports
  const userId = req.user.role === Role.SUPERADMIN ? undefined : req.user.sub;
  
  // Build filters
  const filters: any = {};
  if (dataType) filters.dataType = dataType;
  if (format) filters.format = format;
  if (status) filters.status = status;
  if (search) filters.search = search;
  if (dateFrom) filters.dateFrom = new Date(dateFrom);
  if (dateTo) filters.dateTo = new Date(dateTo);
  if (hasErrors !== undefined) filters.hasErrors = hasErrors;
  
  return this.dataManagementService.getImports(limit, offset, userId, filters);
}
  
    @Post('imports/:id/retry')
    @ApiOperation({ summary: 'Retry a failed import' })
    @ApiParam({ name: 'id', description: 'Import ID' })
    @ApiResponse({ status: 200, description: 'Import retry initiated' })
    @ApiResponse({ status: 404, description: 'Import not found' })
    @ApiResponse({ status: 400, description: 'Only failed imports can be retried' })
    async retryImport(@Param('id') id: string) {
      return this.dataManagementService.retryImport(id);
    }
  
    // Backup methods
    @Post('backups')
    @ApiOperation({ summary: 'Create a new backup' })
    @ApiResponse({ status: 201, description: 'Backup job created successfully' })
    async createBackup(@Body() dto: CreateBackupDto, @Req() req) {
      return this.dataManagementService.createBackup(dto, req.user.sub);
    }
  
    @Get('backups')
    @ApiOperation({ summary: 'Get list of backups' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of records to skip' })
    @ApiQuery({ name: 'type', required: false, enum: BackupType, description: 'Filter by backup type' })
    @ApiQuery({ name: 'status', required: false, enum: DataOperationStatus, description: 'Filter by status' })
    @ApiQuery({ name: 'search', required: false, description: 'Search in name' })
    @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter by date from (ISO format)' })
    @ApiQuery({ name: 'dateTo', required: false, description: 'Filter by date to (ISO format)' })
    @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID (superadmin only)' })
    @ApiQuery({ name: 'minSize', required: false, type: Number, description: 'Filter by minimum size in bytes' })
    @ApiQuery({ name: 'maxSize', required: false, type: Number, description: 'Filter by maximum size in bytes' })
    @ApiResponse({ status: 200, description: 'Returns list of backups' })
    async getBackups(
      @Req() req,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
      @Query('type') type?: BackupType,
      @Query('status') status?: DataOperationStatus,
      @Query('search') search?: string,
      @Query('dateFrom') dateFrom?: string,
      @Query('dateTo') dateTo?: string,
      @Query('userId') userId?: string,
      @Query('minSize', new ParseIntPipe({ optional: true })) minSize?: number,
      @Query('maxSize', new ParseIntPipe({ optional: true })) maxSize?: number,
    ) {
      // Only superadmins can filter by userId
      if (userId && req.user.role !== Role.SUPERADMIN) {
        userId = undefined;
      }
      
      // Build filters
      const filters: any = {};
      if (type) filters.type = type;
      if (status) filters.status = status;
      if (search) filters.search = search;
      if (dateFrom) filters.dateFrom = new Date(dateFrom);
      if (dateTo) filters.dateTo = new Date(dateTo);
      if (userId) filters.userId = userId;
      if (minSize !== undefined) filters.minSize = minSize;
      if (maxSize !== undefined) filters.maxSize = maxSize;
      
      return this.dataManagementService.getBackups(limit, offset, filters);
    }
  
    @Get('backups/:id')
    @ApiOperation({ summary: 'Get backup details' })
    @ApiParam({ name: 'id', description: 'Backup ID' })
    @ApiResponse({ status: 200, description: 'Returns backup details' })
    @ApiResponse({ status: 404, description: 'Backup not found' })
    async getBackup(@Param('id') id: string) {
      return this.dataManagementService.getBackup(id);
    }
  
    @Post('backups/:id/restore')
    @ApiOperation({ summary: 'Restore from backup' })
    @ApiParam({ name: 'id', description: 'Backup ID' })
    @ApiResponse({ status: 200, description: 'Backup restoration initiated' })
    @ApiResponse({ status: 404, description: 'Backup not found' })
    @ApiResponse({ status: 400, description: 'Only completed backups can be restored' })
    async restoreBackup(@Param('id') id: string) {
      return this.dataManagementService.restoreBackup(id);
    }
  
    @Get('backups/:id/download')
    @ApiOperation({ summary: 'Download backup file' })
    @ApiParam({ name: 'id', description: 'Backup ID' })
    @ApiResponse({ status: 200, description: 'File download' })
    @ApiResponse({ status: 404, description: 'Backup file not found' })
    async downloadBackup(@Param('id') id: string, @Res() res: Response) {
      const { filePath, fileName } = await this.dataManagementService.downloadBackup(id);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  
    // Settings methods
    @Get('settings')
    @ApiOperation({ summary: 'Get data management settings' })
    @ApiResponse({ status: 200, description: 'Returns data management settings' })
    async getSettings() {
      return this.dataManagementService.getSettings();
    }
  
    @Patch('settings')
    @ApiOperation({ summary: 'Update data management settings' })
    @ApiResponse({ status: 200, description: 'Settings updated successfully' })
    async updateSettings(@Body() dto: UpdateSettingsDto) {
      return this.dataManagementService.updateSettings(dto);
    }
  }