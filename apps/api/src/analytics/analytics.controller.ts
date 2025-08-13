import { 
  Controller, 
  Get, 
  Query, 
  UseGuards, 
  Param, 
  Res,
  HttpStatus,
  ParseIntPipe, 
  DefaultValuePipe,
  StreamableFile 
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import { join } from 'path';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiQuery, 
  ApiResponse, 
  ApiParam 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsDashboard,
  UserGrowthAnalytics,
  RevenueAnalytics,
  FeatureUsageAnalytics,
  UserSourceAnalytics,
  DeviceAnalytics
} from './analytics.types';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get analytics dashboard data' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include in the analysis (default: 30)' })
  @ApiQuery({ name: 'compare', required: false, type: Boolean, description: 'Whether to include growth comparison with previous period' })
  @ApiResponse({ status: 200, description: 'Returns analytics dashboard data' })
  async getDashboard(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
    @Query('compare', new DefaultValuePipe(true)) compare: boolean
  ): Promise<AnalyticsDashboard> {
    return this.analyticsService.getDashboardStats(days, { compareWithPrevious: compare });
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user growth analytics' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include (default: 30)' })
  @ApiQuery({ name: 'groupBy', required: false, description: 'Group data by (day, week, month, quarter, year)' })
  @ApiResponse({ status: 200, description: 'Returns user growth analytics' })
  async getUserGrowth(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
    @Query('groupBy', new DefaultValuePipe('day')) groupBy: string
  ): Promise<UserGrowthAnalytics> {
    return this.analyticsService.getUserGrowthAnalytics(days, groupBy);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year to analyze (default: current year)' })
  @ApiResponse({ status: 200, description: 'Returns revenue analytics' })
  async getRevenue(
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number
  ): Promise<RevenueAnalytics> {
    return this.analyticsService.getRevenueAnalytics(year);
  }

  @Get('features')
  @ApiOperation({ summary: 'Get feature usage analytics' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include (default: 30)' })
  @ApiResponse({ status: 200, description: 'Returns feature usage analytics' })
  async getFeatureUsage(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number
  ): Promise<FeatureUsageAnalytics> {
    return this.analyticsService.getFeatureUsageAnalytics(days);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get user acquisition sources' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include (default: 30)' })
  @ApiResponse({ status: 200, description: 'Returns user acquisition sources' })
  async getUserSources(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number
  ): Promise<UserSourceAnalytics> {
    return this.analyticsService.getUserSourceAnalytics(days);
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get device usage breakdown' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include (default: 30)' })
  @ApiResponse({ status: 200, description: 'Returns device usage breakdown' })
  async getDevices(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number
  ): Promise<DeviceAnalytics> {
    return this.analyticsService.getDeviceAnalytics(days);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Export dashboard data to Excel' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include (default: 30)' })
  @ApiResponse({ status: 200, description: 'Downloads Excel file with dashboard data' })
  async exportExcel(
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const report = await this.analyticsService.generateDashboardExcelReport(days);
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${report.fileName}"`,
    });
    
    const file = createReadStream(report.filePath);
    return new StreamableFile(file);
  }

  @Get('export/csv/:reportType')
  @ApiOperation({ summary: 'Export specific analytics data to CSV' })
  @ApiParam({ name: 'reportType', description: 'Type of report to export (users, revenue, features, sources, devices)' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to include (default: 30)' })
  @ApiResponse({ status: 200, description: 'Downloads CSV file with requested data' })
  async exportCsv(
    @Param('reportType') reportType: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile | void> {
    const validReportTypes = ['users', 'revenue', 'features', 'sources', 'devices'];
    
    if (!validReportTypes.includes(reportType)) {
      res.status(HttpStatus.BAD_REQUEST).send({ 
        message: `Invalid report type. Must be one of: ${validReportTypes.join(', ')}` 
      });
      return;
    }
    
    const report = await this.analyticsService.generateCsvReport(reportType, days);
    
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${report.fileName}"`,
    });
    
    const file = createReadStream(report.filePath);
    return new StreamableFile(file);
  }
}