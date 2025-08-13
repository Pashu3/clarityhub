import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateExportDto, 
  CreateImportDto, 
  CreateBackupDto, 
  UpdateSettingsDto 
} from './dto';
import { 
  DataExport, 
  DataImport, 
  DataBackup, 
  DataSettings, 
  DataOperationStatus,
  DataType,
  BackupType
} from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DataManagementService {
  private readonly exportsDir = path.join(process.cwd(), 'data', 'exports');
  private readonly importsDir = path.join(process.cwd(), 'data', 'imports');
  private readonly backupsDir = path.join(process.cwd(), 'data', 'backups');

  constructor(private prisma: PrismaService) {
    // Ensure directories exist
    this.ensureDirectoryExists(this.exportsDir);
    this.ensureDirectoryExists(this.importsDir);
    this.ensureDirectoryExists(this.backupsDir);
  }

  private ensureDirectoryExists(directory: string) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  // Dashboard/Overview Methods
  async getDashboardStats() {
    const [
      userCount,
      leadCount,
      uploadCount,
      transactionCount,
      dbSize
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lead.count(),
      this.prisma.upload.count(),
      this.prisma.leadInteraction.count(),
      this.getDatabaseSize(),
    ]);

    // Get growth rates - this is a simplified approach
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      recentUsers,
      recentLeads,
      recentUploads,
      recentTransactions
    ] = await Promise.all([
      this.prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.lead.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.upload.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.leadInteraction.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = userCount > 0 ? (recentUsers / userCount) * 100 : 0;
    const leadGrowth = leadCount > 0 ? (recentLeads / leadCount) * 100 : 0;
    const uploadGrowth = uploadCount > 0 ? (recentUploads / uploadCount) * 100 : 0;
    const transactionGrowth = transactionCount > 0 ? (recentTransactions / transactionCount) * 100 : 0;

    // Get recent activity
    const recentActivity = await this.getRecentActivity();
    
const databaseInsights = {
  storageUsage: {
    used: dbSize ?? 458300000, // Use nullish coalescing instead of logical OR
    total: 500000000, // 500 GB
    available: 500000000 - (dbSize ?? 458300000),
  },
  queryPerformance: {
    avgResponse: 42, // ms
    change: -12, // ms improvement
  },
  connectionPool: await this.getConnectionPoolStats(),
};

    // Get top growing entities
    const topGrowingEntities = [
      { entity: 'Users', growth: userGrowth.toFixed(1) },
      { entity: 'Leads', growth: leadGrowth.toFixed(1) },
      { entity: 'Uploads', growth: uploadGrowth.toFixed(1) },
      { entity: 'Transactions', growth: transactionGrowth.toFixed(1) },
    ].sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth));

    return {
      entityStatistics: [
        {
          name: 'Users',
          count: userCount,
          growth: userGrowth.toFixed(1),
        },
        {
          name: 'Leads',
          count: leadCount,
          growth: leadGrowth.toFixed(1),
        },
        {
          name: 'Uploads',
          count: uploadCount,
          growth: uploadGrowth.toFixed(1),
        },
        {
          name: 'Interactions',
          count: transactionCount,
          growth: transactionGrowth.toFixed(1),
        },
      ],
      recentActivity,
      databaseInsights,
      topGrowingEntities: topGrowingEntities.slice(0, 5),
    };
  }

// Update return type to include null
private async getDatabaseSize(): Promise<number | null> {
  try {
    // This is a simple example - in a real app, you might query your DB directly
    return 458300000; // Placeholder for 458.3 GB in bytes
  } catch (error) {
    console.error('Error getting database size:', error);
    return null;
  }
}

  private async getConnectionPoolStats() {
    try {
      // In a real app, you would query your database connection pool
      return {
        active: 24,
        total: 100,
        available: 76,
        utilization: 24, // percent
      };
    } catch (error) {
      console.error('Error getting connection pool stats:', error);
      return {
        active: 0,
        total: 100,
        available: 100,
        utilization: 0,
      };
    }
  }

  async getRecentActivity(type?: string) {
    const where = {};
    
    if (type) {
      switch (type.toLowerCase()) {
        case 'exports':
          return this.getRecentExports();
        case 'imports':
          return this.getRecentImports();
        case 'backups':
          return this.getRecentBackups();
      }
    }

    // Get all types of activity
    const [exports, imports, backups] = await Promise.all([
      this.getRecentExports(),
      this.getRecentImports(),
      this.getRecentBackups()
    ]);

    // Combine and sort by date
    const allActivity = [
      ...exports.map(e => ({ 
        ...e, 
        activityType: 'Export',
        date: e.createdAt,
      })),
      ...imports.map(i => ({ 
        ...i, 
        activityType: 'Import',
        date: i.createdAt,
      })),
      ...backups.map(b => ({ 
        ...b, 
        activityType: 'Backup',
        date: b.createdAt,
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allActivity.slice(0, 10); // Return the 10 most recent activities
  }

  // Export Methods
  async createExport(dto: CreateExportDto, userId: string): Promise<DataExport> {
    const export_ = await this.prisma.dataExport.create({
      data: {
        name: dto.name,
        dataType: dto.dataType,
        format: dto.format,
        status: DataOperationStatus.PENDING,
        userId,
      },
    });

    // In a real app, you'd process the export asynchronously
    this.processExport(export_.id, dto);

    return export_;
  }

  private async processExport(exportId: string, dto: CreateExportDto) {
    try {
      // Update status to processing
      await this.prisma.dataExport.update({
        where: { id: exportId },
        data: { status: DataOperationStatus.PROCESSING },
      });

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate file path
      const fileName = `export_${exportId}_${Date.now()}.${dto.format.toLowerCase()}`;
      const filePath = path.join(this.exportsDir, fileName);

      // In a real app, you would:
      // 1. Query data based on filters
      // 2. Format data based on requested format
      // 3. Write to file
      // 4. Update the export record with file info

      // For this example, we'll create a dummy file
      fs.writeFileSync(filePath, 'Export data would be here');
      const fileSize = fs.statSync(filePath).size;

      // Determine record count based on data type
      let recordCount = 0;
      switch (dto.dataType) {
        case DataType.USERS:
          recordCount = await this.prisma.user.count();
          break;
        case DataType.LEADS:
          recordCount = await this.prisma.lead.count();
          break;
        case DataType.UPLOADS:
          recordCount = await this.prisma.upload.count();
          break;
        // Add other data types as needed
      }

      // Update export record
      await this.prisma.dataExport.update({
        where: { id: exportId },
        data: {
          status: DataOperationStatus.COMPLETED,
          filePath,
          fileSize,
          recordCount,
        },
      });
    } catch (error) {
      console.error(`Error processing export ${exportId}:`, error);
      
      // Update export record with failed status
      await this.prisma.dataExport.update({
        where: { id: exportId },
        data: {
          status: DataOperationStatus.FAILED,
        },
      });
    }
  }

  async getExports(
    limit = 10, 
    offset = 0, 
    userId?: string, 
    filters?: {
      dataType?: DataType,
      format?: string,
      status?: DataOperationStatus,
      search?: string,
      dateFrom?: Date,
      dateTo?: Date,
    }
  ) {
    // Build where clause
    let where: any = {};
    
    // Add user filter if provided
    if (userId) {
      where.userId = userId;
    }
    
    // Add other filters
    if (filters) {
      if (filters.dataType) {
        where.dataType = filters.dataType;
      }
      
      if (filters.format) {
        where.format = filters.format;
      }
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      // Add date range filter
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        
        if (filters.dateFrom) {
          where.createdAt.gte = filters.dateFrom;
        }
        
        if (filters.dateTo) {
          where.createdAt.lte = filters.dateTo;
        }
      }
      
      // Add search filter (search in name)
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }
  
    const [exports, total] = await Promise.all([
      this.prisma.dataExport.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.dataExport.count({ where }),
    ]);
  
    return {
      data: exports,
      meta: {
        total,
        limit,
        offset,
        filters: filters || {},
      },
    };
  }

  async getRecentExports(limit = 5) {
    return this.prisma.dataExport.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getExport(id: string): Promise<DataExport> {
    const export_ = await this.prisma.dataExport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!export_) {
      throw new NotFoundException(`Export with ID ${id} not found`);
    }

    return export_;
  }

  async downloadExport(id: string): Promise<{ filePath: string; fileName: string }> {
    const export_ = await this.getExport(id);

    if (!export_.filePath || !fs.existsSync(export_.filePath)) {
      throw new NotFoundException('Export file not found');
    }

    return {
      filePath: export_.filePath,
      fileName: path.basename(export_.filePath),
    };
  }

  async createImport(dto: CreateImportDto, file: Express.Multer.File, userId: string): Promise<DataImport> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }
  
    // Determine format from file extension
    const extension = path.extname(file.originalname).toLowerCase().substring(1);
    const format = extension === 'json' ? 'JSON' : extension.toUpperCase();
  
    // Create import record
    const import_ = await this.prisma.dataImport.create({
      data: {
        name: dto.name,
        dataType: dto.dataType,
        format: format as any,
        filePath: file.path,
        fileSize: file.size,
        status: dto.validateOnly ? DataOperationStatus.PROCESSING : DataOperationStatus.PENDING,
        userId,
      },
    });
  
    // Process the import (validate or import)
    if (dto.validateOnly) {
      this.validateImport(import_.id, file.path);
    } else {
      this.processImport(import_.id, { 
        name: import_.name, 
        dataType: import_.dataType,
        validateOnly: false,
        updateExisting: false
      } as CreateImportDto, import_.filePath);
    }
  
    return import_;
  }

  private async validateImport(importId: string, filePath: string) {
    try {
      // In a real app, you would:
      // 1. Parse the file
      // 2. Validate the data
      // 3. Generate validation report

      // For this example, we'll simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const validationResult = {
        valid: true,
        errors: [],
        warnings: [],
      };

      await this.prisma.dataImport.update({
        where: { id: importId },
        data: {
          status: DataOperationStatus.COMPLETED,
          validationLog: JSON.stringify(validationResult),
        },
      });
    } catch (error) {
      console.error(`Error validating import ${importId}:`, error);
      
      await this.prisma.dataImport.update({
        where: { id: importId },
        data: {
          status: DataOperationStatus.FAILED,
          validationLog: JSON.stringify({ valid: false, errors: [error.message] }),
        },
      });
    }
  }

  private async processImport(importId: string, dto: CreateImportDto, filePath: string) {
    try {
      await this.prisma.dataImport.update({
        where: { id: importId },
        data: { status: DataOperationStatus.PROCESSING },
      });

      // In a real app, you would:
      // 1. Parse the file
      // 2. Process the records
      // 3. Update database

      // For this example, we'll simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate record count and success/failure
      const recordCount = 100;
      const successCount = 95;
      const failedCount = 5;

      await this.prisma.dataImport.update({
        where: { id: importId },
        data: {
          status: failedCount > 0 ? DataOperationStatus.COMPLETED_WITH_ERRORS : DataOperationStatus.COMPLETED,
          recordCount,
          successCount,
          failedCount,
        },
      });
    } catch (error) {
      console.error(`Error processing import ${importId}:`, error);
      
      await this.prisma.dataImport.update({
        where: { id: importId },
        data: {
          status: DataOperationStatus.FAILED,
        },
      });
    }
  }

  async getImports(
    limit = 10, 
    offset = 0, 
    userId?: string,
    filters?: {
      dataType?: DataType,
      format?: string,
      status?: DataOperationStatus,
      search?: string,
      dateFrom?: Date,
      dateTo?: Date,
      hasErrors?: boolean,
    }
  ) {
    // Build where clause
    let where: any = {};
    
    // Add user filter if provided
    if (userId) {
      where.userId = userId;
    }
    
    // Add other filters
    if (filters) {
      if (filters.dataType) {
        where.dataType = filters.dataType;
      }
      
      if (filters.format) {
        where.format = filters.format;
      }
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      // Filter by has errors
      if (filters.hasErrors === true) {
        where.failedCount = { gt: 0 };
      } else if (filters.hasErrors === false) {
        where.failedCount = 0;
      }
      
      // Add date range filter
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        
        if (filters.dateFrom) {
          where.createdAt.gte = filters.dateFrom;
        }
        
        if (filters.dateTo) {
          where.createdAt.lte = filters.dateTo;
        }
      }
      
      // Add search filter (search in name)
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }
  
    const [imports, total] = await Promise.all([
      this.prisma.dataImport.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.dataImport.count({ where }),
    ]);
  
    return {
      data: imports,
      meta: {
        total,
        limit,
        offset,
        filters: filters || {},
      },
    };
  }

  async getRecentImports(limit = 5) {
    return this.prisma.dataImport.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getImport(id: string): Promise<DataImport> {
    const import_ = await this.prisma.dataImport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!import_) {
      throw new NotFoundException(`Import with ID ${id} not found`);
    }

    return import_;
  }

  async retryImport(id: string): Promise<DataImport> {
    const import_ = await this.getImport(id);
  
    if (import_.status !== DataOperationStatus.FAILED) {
      throw new BadRequestException('Only failed imports can be retried');
    }
  
    await this.prisma.dataImport.update({
      where: { id },
      data: { status: DataOperationStatus.PENDING },
    });
  
    // Process the import - use the id parameter here
    this.processImport(id, { 
      name: import_.name, 
      dataType: import_.dataType,
      validateOnly: false,
      updateExisting: false
    } as CreateImportDto, import_.filePath);
  
    return this.getImport(id);
  }
  // Backup Methods
  async createBackup(dto: CreateBackupDto, userId: string): Promise<DataBackup> {
    const backup = await this.prisma.dataBackup.create({
      data: {
        name: dto.name,
        type: dto.type,
        status: DataOperationStatus.PENDING,
        retention: dto.retention || 30, // Default 30 days
        userId,
      },
    });

    // Process backup in background
    this.processBackup(backup.id, dto);

    return backup;
  }

  private async processBackup(backupId: string, dto: CreateBackupDto) {
    try {
      // Update status to processing
      await this.prisma.dataBackup.update({
        where: { id: backupId },
        data: { status: DataOperationStatus.PROCESSING },
      });

      // Simulate backup process
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real app, you would:
      // 1. Determine what to backup based on type and dataSelection
      // 2. Export data or create a database dump
      // 3. Compress the backup
      // 4. Store it in the specified location

      // For this example, we'll create a dummy file
      const fileName = `backup_${backupId}_${Date.now()}.zip`;
      const filePath = path.join(this.backupsDir, fileName);
      fs.writeFileSync(filePath, 'Backup data would be here');
      const fileSize = fs.statSync(filePath).size;

      // Calculate duration
      const duration = Math.floor((Date.now() - startTime) / 1000);

      // Update backup record
      await this.prisma.dataBackup.update({
        where: { id: backupId },
        data: {
          status: DataOperationStatus.COMPLETED,
          filePath,
          fileSize,
          duration,
        },
      });
    } catch (error) {
      console.error(`Error processing backup ${backupId}:`, error);
      
      await this.prisma.dataBackup.update({
        where: { id: backupId },
        data: {
          status: DataOperationStatus.FAILED,
        },
      });
    }
  }

  async getBackups(
    limit = 10, 
    offset = 0,
    filters?: {
      type?: BackupType,
      status?: DataOperationStatus,
      search?: string,
      dateFrom?: Date,
      dateTo?: Date,
      userId?: string,
      minSize?: number,
      maxSize?: number,
    }
  ) {
    // Build where clause
    let where: any = {};
    
    // Add filters
    if (filters) {
      if (filters.type) {
        where.type = filters.type;
      }
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      if (filters.userId) {
        where.userId = filters.userId;
      }
      
      // Size range filter (in bytes)
      if (filters.minSize !== undefined || filters.maxSize !== undefined) {
        where.fileSize = {};
        
        if (filters.minSize !== undefined) {
          where.fileSize.gte = filters.minSize;
        }
        
        if (filters.maxSize !== undefined) {
          where.fileSize.lte = filters.maxSize;
        }
      }
      
      // Add date range filter
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        
        if (filters.dateFrom) {
          where.createdAt.gte = filters.dateFrom;
        }
        
        if (filters.dateTo) {
          where.createdAt.lte = filters.dateTo;
        }
      }
      
      // Add search filter (search in name)
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }
  
    const [backups, total] = await Promise.all([
      this.prisma.dataBackup.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.dataBackup.count({ where }),
    ]);
  
    return {
      data: backups,
      meta: {
        total,
        limit,
        offset,
        filters: filters || {},
      },
    };
  }

  async getRecentBackups(limit = 5) {
    return this.prisma.dataBackup.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getBackup(id: string): Promise<DataBackup> {
    const backup = await this.prisma.dataBackup.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!backup) {
      throw new NotFoundException(`Backup with ID ${id} not found`);
    }

    return backup;
  }

  async downloadBackup(id: string): Promise<{ filePath: string; fileName: string }> {
    const backup = await this.getBackup(id);

    if (!backup.filePath || !fs.existsSync(backup.filePath)) {
      throw new NotFoundException('Backup file not found');
    }

    return {
      filePath: backup.filePath,
      fileName: path.basename(backup.filePath),
    };
  }

  async restoreBackup(id: string): Promise<DataBackup> {
    const backup = await this.getBackup(id);

    if (backup.status !== DataOperationStatus.COMPLETED) {
      throw new BadRequestException('Only completed backups can be restored');
    }

    // In a real app, you would:
    // 1. Validate the backup file
    // 2. Create a new database connection
    // 3. Restore the data
    // 4. Verify the restoration

    // For this example, we'll just return the backup
    return backup;
  }

  // Data Settings Methods
  async getSettings(): Promise<DataSettings> {
    const settings = await this.prisma.dataSettings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      return this.prisma.dataSettings.create({
        data: {},
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<DataSettings> {
    const settings = await this.getSettings();

    return this.prisma.dataSettings.update({
      where: { id: settings.id },
      data: dto,
    });
  }
}