import { Injectable, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { Express, Response } from 'express';
import { createReadStream, promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import * as fastcsv from 'fast-csv';
import { AiService } from '../ai/ai.service';
import { UploadUsageService } from '../upload-usage/upload-usage.service';
import { Chart, KPI, UploadResponse } from './upload.types'; // Import the shared types

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private uploadUsageService: UploadUsageService
  ) {}

  async saveFileMetadata(file: Express.Multer.File, userId?: string, ipAddress?: string): Promise<UploadResponse> {
    const { filename, mimetype, size, path } = file;
  
    const uploadPermission = await this.uploadUsageService.checkUploadAllowed(userId, ipAddress);
    if (!uploadPermission.allowed) {
      throw new ForbiddenException(uploadPermission.message || 'Upload not allowed');
    }
  
    const upload = await this.prisma.upload.create({
      data: {
        filename,
        mimetype,
        size,
        path,
        userId, 
        guestId: !userId ? ipAddress : undefined, 
      },
    });
  
    // Log the usage
    await this.uploadUsageService.createUsageRecord(upload.id, userId, ipAddress);
  
    const stats = await this.parseCsvAndGenerateStats(path, upload.id);
  
    const rows = await this.prisma.csvRow.findMany({
      where: { fileId: upload.id },
      take: 50, 
    });
  
    let summary = 'Data uploaded successfully. Basic analysis available.';
    let kpis: KPI[] = [];
    let charts: Chart[] = [];
  
    // Wrap AI calls in try/catch to handle API errors
    try {
      const previewData = rows.slice(0, 10);
      summary = await this.aiService.generateSummaryAndKPIs(previewData);
      const aiResults = await this.aiService.generateKPIsAndCharts(rows);
      kpis = aiResults.kpis || [];
      charts = aiResults.charts || [];
  
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { 
          summary, 
          kpis: kpis as any, 
          charts: charts as any, 
        },
      });
    } catch (error) {
      console.error('Error generating AI insights:', error);
      
      // Still update the upload, but with basic info
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { 
          summary: 'AI analysis unavailable. You can still explore your data using the built-in tools.',
          kpis: [],
          charts: []
        },
      });
    }
  
    let remainingUploads: number | string = 0;
    
    if (typeof uploadPermission.remaining === 'number') {
      remainingUploads = uploadPermission.remaining > 0 ? uploadPermission.remaining - 1 : 0;
    } else if (uploadPermission.reason === 'PREMIUM_SUBSCRIPTION') {
      remainingUploads = 'unlimited';
    }
  
    return {
      message: 'File uploaded successfully',
      fileId: upload.id,
      filename: upload.filename,
      status: upload.status,
      createdAt: upload.createdAt,
      summary,
      kpis,
      charts,
      stats,
      uploadLimits: {
        remaining: remainingUploads,
        userType: userId ? 'registered' : 'guest',
        plan: uploadPermission.reason === 'PREMIUM_SUBSCRIPTION' ? 'premium' : 'free'
      }
    };
  }
  

  async getUploadById(id: string, userId?: string, ipAddress?: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
      include: {
        csvRows: { take: 10 }, 
      },
    });

    if (!upload) {
      throw new UnauthorizedException('Upload not found');
    }

    if (!userId && upload.guestId === ipAddress) {
      return upload;
    }

    if (userId && upload.userId && upload.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this upload');
    }

    return upload;
  }

  async deleteUpload(id: string, userId?: string, ipAddress?: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      throw new UnauthorizedException('Upload not found');
    }

    if (!userId && upload.guestId === ipAddress) {
    }
    else if (userId && upload.userId && upload.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this upload');
    }

    try {
      if (upload?.path) {
        await fsPromises.unlink(upload.path);
      }
    } catch (err) {
      console.error(`Failed to delete file at ${upload?.path}`, err);
    }

    return this.prisma.upload.delete({
      where: { id },
    });
  }

  async getUploads(
    page = 1, 
    limit = 10,
    search?: string,
    startDate?: Date,
    endDate?: Date,
    userId?: string,
    ipAddress?: string
  ) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    } else if (ipAddress) {
      where.guestId = ipAddress;
    } else {
      return {
        uploads: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
    
    // Add search
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [uploads, total] = await Promise.all([
      this.prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.upload.count({ where }),
    ]);

    return {
      uploads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async exportCsv(fileId: string, res: Response) {
    try {
      const rows = await this.prisma.csvRow.findMany({
        where: { fileId },
      });
  
      const csvData = rows
        .map(row => row.data)
        .filter(data => data !== null) as Record<string, any>[];
      
      const csvFilePath = path.join(__dirname, `../uploads/${fileId}-export.csv`);
  
      const ws = fs.createWriteStream(csvFilePath);
  
      fastcsv
        .write(csvData, { headers: true })
        .pipe(ws)
        .on('finish', () => {
          res.download(csvFilePath, (err) => {
            if (err) {
              throw new InternalServerErrorException('Error while downloading CSV');
            }
            fs.unlink(csvFilePath, () => {});
          });
        });
  
    } catch (err) {
      throw new InternalServerErrorException('Failed to export CSV: ' + err.message);
    }
  }
  async checkUploadLimits(userId?: string, ipAddress?: string, subscription?: any) {
    return this.uploadUsageService.checkUploadAllowed(userId, ipAddress, subscription);
  }
  async searchRows(
    fileId: string, 
    searchTerm: string, 
    page = 1, 
    limit = 10
  ) {
    try {
      const allRows = await this.prisma.csvRow.findMany({
        where: { fileId },
      });
      
      const filteredRows = allRows.filter(row => {
        const values = Object.values(row.data as Record<string, any>);
        return values.some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      
      const paginatedRows = filteredRows.slice((page - 1) * limit, page * limit);
      
      return {
        rows: paginatedRows,
        pagination: {
          page,
          limit,
          total: filteredRows.length,
          totalPages: Math.ceil(filteredRows.length / limit),
        }
      };
      
    } catch (err) {
      throw new InternalServerErrorException('Failed to search rows: ' + err.message);
    }
  }

  private async parseCsvAndGenerateStats(path: string, fileId: string) {
    return new Promise((resolve, reject) => {
      const parser = parse({ columns: true, skip_empty_lines: true });
      const input = createReadStream(path);

      let rowCount = 0;
      let columnNames: string[] = [];
      const nullCounts: Record<string, number> = {};
      const rowsToInsert: any[] = [];

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          rowCount++;

          if (rowCount === 1) {
            columnNames = Object.keys(record);
            columnNames.forEach((col) => {
              nullCounts[col] = 0;
            });
          }

          for (const col of columnNames) {
            if (record[col] === '' || record[col] === null || record[col] === undefined) {
              nullCounts[col]++;
            }
          }

          rowsToInsert.push({
            data: record,
            fileId,
          });
        }
      });

      parser.on('error', (err) => {
        reject(new InternalServerErrorException('CSV parsing failed: ' + err.message));
      });

      parser.on('end', async () => {
        try {
          await this.prisma.csvRow.createMany({
            data: rowsToInsert,
          });

          resolve({
            rowCount,
            columnCount: columnNames.length,
            columnNames,
            nullCounts,
          });
        } catch (err) {
          reject(new InternalServerErrorException('Failed to store parsed rows.'));
        }
      });

      input.pipe(parser);
    });
  }
}