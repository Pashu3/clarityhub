import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { Express, Response } from 'express';
import { createReadStream, promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import * as fastcsv from 'fast-csv';
import { AiService } from '../ai/ai.service'; 

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService 
  ) {}

  async saveFileMetadata(file: Express.Multer.File, userId: string) {
    const { filename, mimetype, size, path } = file;

    const upload = await this.prisma.upload.create({
      data: {
        filename,
        mimetype,
        size,
        path,
        userId,
      },
    });

    const stats = await this.parseCsvAndGenerateStats(path, upload.id);

    const rows = await this.prisma.csvRow.findMany({
      where: { fileId: upload.id },
      take: 50, 
    });

    const previewData = rows.slice(0, 10);
    const summary = await this.aiService.generateSummaryAndKPIs(previewData);

    const { kpis, charts } = await this.aiService.generateKPIsAndCharts(rows);

    await this.prisma.upload.update({
      where: { id: upload.id },
      data: { summary, kpis, charts },
    });

    return {
      message: 'File uploaded successfully',
      fileId: upload.id,
      filename: upload.filename,
      status: upload.status,
      createdAt: upload.createdAt,
      summary,
      kpis,
      charts,
      stats
    };
  }

  async getUploadById(id: string, userId?: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
      include: {
        csvRows: { take: 10 }, 
      },
    });

    if (userId && upload?.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this upload');
    }

    return upload;
  }

  async deleteUpload(id: string, userId?: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
    });

    if (userId && upload?.userId !== userId) {
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

  async getUploadsForUser(
    userId: string, 
    page = 1, 
    limit = 10,
    search?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    // Build where clause with filters
    const where: any = { userId };
    
    // Add search
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Add date range filter
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
            // Clean up the file after download
            fs.unlink(csvFilePath, () => {});
          });
        });
  
    } catch (err) {
      throw new InternalServerErrorException('Failed to export CSV: ' + err.message);
    }
  }
  
  async searchRows(
    fileId: string, 
    searchTerm: string, 
    page = 1, 
    limit = 10
  ) {
    try {
      // This is a simplified approach - for production, consider using a database
      // that supports full-text search like Postgres with pg_trgm extension
      const allRows = await this.prisma.csvRow.findMany({
        where: { fileId },
      });
      
      // Filter rows that contain the search term in any field
      const filteredRows = allRows.filter(row => {
        const values = Object.values(row.data as Record<string, any>);
        return values.some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      
      // Apply pagination
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