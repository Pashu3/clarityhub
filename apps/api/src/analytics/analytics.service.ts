import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Provider } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import {
  DatePeriod,
  DeviceData,
  SourceData,
  DashboardOptions,
  AnalyticsDashboard,
  UserGrowthAnalytics,
  RevenueAnalytics,
  FeatureUsageAnalytics,
  UserSourceAnalytics,
  DeviceAnalytics,
  ExportResult
} from './analytics.types';

@Injectable()
export class AnalyticsService {
  private readonly exportsDir = path.join(process.cwd(), 'data', 'analytics-exports');

  constructor(private prisma: PrismaService) {
    // Ensure exports directory exists
    if (!fs.existsSync(this.exportsDir)) {
      fs.mkdirSync(this.exportsDir, { recursive: true });
    }
  }

  async getDashboardStats(timeRange = 30, options: DashboardOptions = {}): Promise<AnalyticsDashboard> {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - timeRange);
    
    const prevPeriodStartDate = new Date(startDate);
    prevPeriodStartDate.setDate(prevPeriodStartDate.getDate() - timeRange);

    // Get key metrics for current period
    const [
      currentUserCount,
      currentActiveUsers,
      currentRevenue,
      currentSessions
    ] = await Promise.all([
      this.getUserCount(startDate, today),
      this.getActiveUserCount(startDate, today),
      this.getRevenue(startDate, today),
      this.getAverageSessionTime(startDate, today)
    ]);

    // Get previous period metrics if requested
    let userGrowth = 0;
    let activeUserGrowth = 0;
    let revenueGrowth = 0;
    let sessionGrowth = 0;

    if (options.compareWithPrevious) {
      const [
        prevUserCount,
        prevActiveUsers,
        prevRevenue,
        prevSessions
      ] = await Promise.all([
        this.getUserCount(prevPeriodStartDate, startDate),
        this.getActiveUserCount(prevPeriodStartDate, startDate),
        this.getRevenue(prevPeriodStartDate, startDate),
        this.getAverageSessionTime(prevPeriodStartDate, startDate)
      ]);

      // Calculate growth percentages
      userGrowth = this.calculateGrowth(currentUserCount, prevUserCount);
      activeUserGrowth = this.calculateGrowth(currentActiveUsers, prevActiveUsers);
      revenueGrowth = this.calculateGrowth(currentRevenue, prevRevenue);
      sessionGrowth = this.calculateGrowth(currentSessions, prevSessions);
    }

    // Get detailed data for charts
    const [
      userActivity,
      revenueOverview,
      featureUsage,
      trafficSources,
      deviceBreakdown
    ] = await Promise.all([
      this.getUserActivity(timeRange),
      this.getRevenueOverview(),
      this.getFeatureUsage(startDate, today),
      this.getTrafficSources(startDate, today),
      this.getDeviceBreakdown(startDate, today)
    ]);

    return {
      keyMetrics: {
        totalUsers: {
          value: currentUserCount,
          growth: userGrowth,
          formattedValue: currentUserCount.toLocaleString()
        },
        activeUsers: {
          value: currentActiveUsers,
          growth: activeUserGrowth,
          formattedValue: currentActiveUsers.toLocaleString()
        },
        revenue: {
          value: currentRevenue,
          growth: revenueGrowth,
          formattedValue: `$${(currentRevenue / 1000).toFixed(1)}K`
        },
        averageSession: {
          value: currentSessions,
          growth: sessionGrowth,
          formattedValue: this.formatSessionTime(currentSessions)
        }
      },
      userActivity,
      revenueOverview,
      featureUsage,
      trafficSources,
      deviceBreakdown,
      timeRange,
      period: {
        start: startDate,
        end: today
      }
    };
  }

  async getUserGrowthAnalytics(timeRange = 30, groupBy = 'day'): Promise<UserGrowthAnalytics> {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - timeRange);

    // Define how to group by different time periods
    const groupFormats: Record<string, { format: string, interval: number }> = {
      day: { format: '%Y-%m-%d', interval: 1 },
      week: { format: '%Y-%U', interval: 7 },
      month: { format: '%Y-%m', interval: 30 },
      quarter: { format: '%Y-%Q', interval: 91 },
      year: { format: '%Y', interval: 365 }
    };

    // Get growth data based on selected timeframe
    const format = groupFormats[groupBy] || groupFormats.day;
    
    // For a real-world app, you'd use SQL date functions to group by time period
    // Here we'll simulate it by fetching all users and grouping in memory
    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: today
        }
      },
      select: {
        id: true,
        createdAt: true,
        lastSeenAt: true
      }
    });

    // Group by time period
    const usersByPeriod: Record<string, number> = {};
    const activitiesByPeriod: Record<string, number> = {};

    users.forEach(user => {
      // Format the date based on groupBy
      let periodKey: string;
      const date = new Date(user.createdAt);
      
      switch(groupBy) {
        case 'week':
          // Get ISO week number
          const firstDay = new Date(date.getFullYear(), 0, 1);
          const weekNum = Math.ceil(
            (((date.getTime() - firstDay.getTime()) / 86400000) + firstDay.getDay() + 1) / 7
          );
          periodKey = `${date.getFullYear()}-W${weekNum}`;
          break;

        case 'month':
          periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periodKey = `${date.getFullYear()}-Q${quarter}`;
          break;
        case 'year':
          periodKey = `${date.getFullYear()}`;
          break;
        default: // day
          periodKey = date.toISOString().split('T')[0];
      }
      
      // Count new users
      usersByPeriod[periodKey] = (usersByPeriod[periodKey] || 0) + 1;
      
      // Count active users if they have logged in during this period
      if (user.lastSeenAt && user.lastSeenAt >= startDate) {
        const activityDate = new Date(user.lastSeenAt);
        let activityPeriodKey;
        
        switch(groupBy) {
          case 'week':
            const firstDay = new Date(activityDate.getFullYear(), 0, 1);
            const weekNum = Math.ceil(
              (((activityDate.getTime() - firstDay.getTime()) / 86400000) + firstDay.getDay() + 1) / 7
            );
            activityPeriodKey = `${activityDate.getFullYear()}-W${weekNum}`;
            break;

          case 'month':
            activityPeriodKey = `${activityDate.getFullYear()}-${activityDate.getMonth() + 1}`;
            break;
          case 'quarter':
            const quarter = Math.floor(activityDate.getMonth() / 3) + 1;
            activityPeriodKey = `${activityDate.getFullYear()}-Q${quarter}`;
            break;
          case 'year':
            activityPeriodKey = `${activityDate.getFullYear()}`;
            break;
          default: // day
            activityPeriodKey = activityDate.toISOString().split('T')[0];
        }
        
        activitiesByPeriod[activityPeriodKey] = (activitiesByPeriod[activityPeriodKey] || 0) + 1;
      }
    });

    // Format into a chart-friendly response
    const periods = this.generateDatePeriods(startDate, today, groupBy);
    
    const newUsersData = periods.map(period => usersByPeriod[period.key] || 0);
    const activeUsersData = periods.map(period => activitiesByPeriod[period.key] || 0);
    
    return {
      labels: periods.map(p => p.label),
      datasets: [
        {
          label: 'New Users',
          data: newUsersData
        },
        {
          label: 'Active Users',
          data: activeUsersData
        }
      ],
      totals: {
        newUsers: newUsersData.reduce((sum, val) => sum + val, 0),
        activeUsers: activeUsersData.reduce((sum, val) => sum + val, 0)
      }
    };
  }

  async getRevenueAnalytics(year = new Date().getFullYear()): Promise<RevenueAnalytics> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get subscription data for the year
    const subscriptions = await this.prisma.userSubscription.findMany({
      where: {
        OR: [
          {
            startDate: {
              lte: new Date(year, 11, 31),
            },
            endDate: null,
          },
          {
            startDate: {
              lte: new Date(year, 11, 31),
            },
            endDate: {
              gte: new Date(year, 0, 1),
            },
          },
        ],
      },
    });

    // Calculate revenue and expenses per month
    const revenueData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);
    
    subscriptions.forEach(sub => {
      const startMonth = sub.startDate.getFullYear() === year ? sub.startDate.getMonth() : 0;
      const endMonth = sub.endDate && sub.endDate.getFullYear() === year ? sub.endDate.getMonth() : 11;
      
      // Calculate price based on plan
      const monthlyPrice = sub.plan === 'PREMIUM' ? 49.99 : 0;
      const monthlyExpense = monthlyPrice * 0.6; // 60% of revenue as expense
      
      // Add to each month the subscription was active
      for (let m = startMonth; m <= endMonth; m++) {
        revenueData[m] += monthlyPrice;
        expenseData[m] += monthlyExpense;
      }
    });

    // Round to closest dollar
    const formattedRevenue = revenueData.map(val => Math.round(val));
    const formattedExpense = expenseData.map(val => Math.round(val));
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          data: formattedRevenue
        },
        {
          label: 'Expenses',
          data: formattedExpense
        }
      ],
      totals: {
        revenue: formattedRevenue.reduce((sum, val) => sum + val, 0),
        expenses: formattedExpense.reduce((sum, val) => sum + val, 0),
        profit: formattedRevenue.reduce((sum, val) => sum + val, 0) - 
                formattedExpense.reduce((sum, val) => sum + val, 0)
      },
      year
    };
  }

  async getFeatureUsageAnalytics(timeRange = 30): Promise<FeatureUsageAnalytics> {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - timeRange);

    // Count various feature usages
    const [
      analyticsCount,
      importCount,
      exportCount,
      interactionCount,
      uploadCount,
      leadCount,
    ] = await Promise.all([
      this.prisma.aIQuery.count({  // Fixed from aiQuery to aIQuery (correct casing)
        where: {
          createdAt: {
            gte: startDate,
            lte: today
          }
        }
      }),
      this.prisma.dataImport.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: today
          }
        }
      }),
      this.prisma.dataExport.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: today
          }
        }
      }),
      this.prisma.leadInteraction.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: today
          }
        }
      }),
      this.prisma.upload.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: today
          }
        }
      }),
      this.prisma.lead.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: today
          }
        }
      }),
    ]);

    return {
      labels: ['Analytics', 'Data Imports', 'Data Exports', 'Lead Interactions', 'Uploads', 'Lead Creation'],
      datasets: [
        {
          data: [analyticsCount, importCount, exportCount, interactionCount, uploadCount, leadCount]
        }
      ],
      totals: {
        analyticsCount,
        importCount,
        exportCount,
        interactionCount,
        uploadCount,
        leadCount,
        totalOperations: analyticsCount + importCount + exportCount + interactionCount + uploadCount + leadCount
      },
      timeRange
    };
  }

  async getUserSourceAnalytics(timeRange = 30): Promise<UserSourceAnalytics> {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - timeRange);

    // Count users by provider (source)
    const usersByProvider = await this.prisma.user.groupBy({
      by: ['provider'],
      where: {
        createdAt: {
          gte: startDate,
          lte: today
        }
      },
      _count: {
        id: true
      }
    });

    // Transform to expected format
    const sourceCounts: SourceData[] = usersByProvider.map(item => ({
      name: item.provider,
      value: item._count.id,
      percentage: 0 // Will be calculated next
    }));

    // Calculate percentages
    const total = sourceCounts.reduce((sum, source) => sum + source.value, 0);
    const sourcesWithPercentage: SourceData[] = sourceCounts.map(source => ({
      ...source,
      percentage: total > 0 ? Math.round((source.value / total) * 100) : 0
    }));

    // Add a few more simulated sources if we only have credentials/google from the schema
    if (sourcesWithPercentage.length <= 2) {
      const remaining = 100 - sourcesWithPercentage.reduce((sum, source) => sum + source.percentage, 0);
      if (remaining > 0) {
        // Safe cast for demonstration - in production, would use proper enum values
        const additionalSources: SourceData[] = [
          { name: 'REFERRAL' as unknown as Provider, value: Math.floor(remaining * 0.4), percentage: Math.floor(remaining * 0.4) },
          { name: 'DIRECT' as unknown as Provider, value: Math.floor(remaining * 0.3), percentage: Math.floor(remaining * 0.3) },
          { name: 'OTHER' as unknown as Provider, value: remaining - Math.floor(remaining * 0.7), percentage: remaining - Math.floor(remaining * 0.7) }
        ];
        sourcesWithPercentage.push(...additionalSources);
      }
    }

    return {
      sources: sourcesWithPercentage,
      total,
      timeRange
    };
  }

  async getDeviceAnalytics(timeRange = 30): Promise<DeviceAnalytics> {
    // In a real application, you would track device usage in your database
    // Since we don't have that data, we'll simulate it
    
    // These would normally come from user-agent tracking or analytics integration
    const deviceData: DeviceData[] = [
      { name: 'Desktop', value: 52, percentage: 52 },
      { name: 'Mobile', value: 38, percentage: 38 },
      { name: 'Tablet', value: 10, percentage: 10 }
    ];

    const total = deviceData.reduce((sum, device) => sum + device.value, 0);

    return {
      devices: deviceData,
      total,
      timeRange
    };
  }

  // Generate Excel report with multiple sheets for dashboard data
  async generateDashboardExcelReport(timeRange = 30): Promise<ExportResult> {
    // Get all dashboard data
    const dashboardData = await this.getDashboardStats(timeRange, { compareWithPrevious: true });
    const userGrowth = await this.getUserGrowthAnalytics(timeRange);
    const revenue = await this.getRevenueAnalytics();
    const featureUsage = await this.getFeatureUsageAnalytics(timeRange);
    const userSources = await this.getUserSourceAnalytics(timeRange);
    const deviceData = await this.getDeviceAnalytics(timeRange);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ClarityHub';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Add Dashboard Overview sheet
    const overviewSheet = workbook.addWorksheet('Dashboard Overview');
    overviewSheet.columns = [
      { header: 'Metric', key: 'metric', width: 20 },
      { header: 'Value', key: 'value', width: 15 },
      { header: 'Growth', key: 'growth', width: 15 },
    ];

    // Add header styling
    overviewSheet.getRow(1).font = { bold: true };
    
    // Add key metrics
    overviewSheet.addRow({ 
      metric: 'Total Users', 
      value: dashboardData.keyMetrics.totalUsers.formattedValue, 
      growth: `${dashboardData.keyMetrics.totalUsers.growth}%`
    });
    overviewSheet.addRow({ 
      metric: 'Active Users', 
      value: dashboardData.keyMetrics.activeUsers.formattedValue, 
      growth: `${dashboardData.keyMetrics.activeUsers.growth}%`
    });
    overviewSheet.addRow({ 
      metric: 'Revenue', 
      value: dashboardData.keyMetrics.revenue.formattedValue, 
      growth: `${dashboardData.keyMetrics.revenue.growth}%`
    });
    overviewSheet.addRow({ 
      metric: 'Average Session Time', 
      value: dashboardData.keyMetrics.averageSession.formattedValue, 
      growth: `${dashboardData.keyMetrics.averageSession.growth}%`
    });

    // Add User Growth sheet
    const userGrowthSheet = workbook.addWorksheet('User Growth');
    userGrowthSheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'New Users', key: 'new', width: 15 },
      { header: 'Active Users', key: 'active', width: 15 }
    ];
    userGrowthSheet.getRow(1).font = { bold: true };

    // Add user growth data
    userGrowth.labels.forEach((date, index) => {
      userGrowthSheet.addRow({
        date,
        new: userGrowth.datasets[0].data[index],
        active: userGrowth.datasets[1].data[index]
      });
    });
    
    userGrowthSheet.addRow({});
    userGrowthSheet.addRow({
      date: 'Total',
      new: userGrowth.totals.newUsers,
      active: userGrowth.totals.activeUsers
    });

    // Add Revenue sheet
    const revenueSheet = workbook.addWorksheet('Revenue');
    revenueSheet.columns = [
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Revenue', key: 'revenue', width: 15 },
      { header: 'Expenses', key: 'expenses', width: 15 },
      { header: 'Profit', key: 'profit', width: 15 }
    ];
    revenueSheet.getRow(1).font = { bold: true };

    // Add revenue data
    revenue.labels.forEach((month, index) => {
      revenueSheet.addRow({
        month,
        revenue: `$${revenue.datasets[0].data[index]}`,
        expenses: `$${revenue.datasets[1].data[index]}`,
        profit: `$${revenue.datasets[0].data[index] - revenue.datasets[1].data[index]}`
      });
    });
    
    revenueSheet.addRow({});
    revenueSheet.addRow({
      month: 'Total',
      revenue: `$${revenue.totals.revenue}`,
      expenses: `$${revenue.totals.expenses}`,
      profit: `$${revenue.totals.profit}`
    });

    // Add Feature Usage sheet
    const featureSheet = workbook.addWorksheet('Feature Usage');
    featureSheet.columns = [
      { header: 'Feature', key: 'feature', width: 20 },
      { header: 'Usage Count', key: 'count', width: 15 },
      { header: 'Percentage', key: 'percentage', width: 15 }
    ];
    featureSheet.getRow(1).font = { bold: true };

    // Add feature usage data
    const totalFeatureUsage = featureUsage.totals.totalOperations;
    featureUsage.labels.forEach((feature, index) => {
      const count = featureUsage.datasets[0].data[index];
      const percentage = totalFeatureUsage > 0 
        ? Math.round((count / totalFeatureUsage) * 100) 
        : 0;
      
      featureSheet.addRow({
        feature,
        count,
        percentage: `${percentage}%`
      });
    });
    
    featureSheet.addRow({});
    featureSheet.addRow({
      feature: 'Total',
      count: totalFeatureUsage
    });

    // Add User Sources sheet
    const sourcesSheet = workbook.addWorksheet('User Sources');
    sourcesSheet.columns = [
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Count', key: 'count', width: 15 },
      { header: 'Percentage', key: 'percentage', width: 15 }
    ];
    sourcesSheet.getRow(1).font = { bold: true };

    // Add user sources data
    userSources.sources.forEach(source => {
      sourcesSheet.addRow({
        source: source.name,
        count: source.value,
        percentage: `${source.percentage}%`
      });
    });
    
    sourcesSheet.addRow({});
    sourcesSheet.addRow({
      source: 'Total',
      count: userSources.total
    });

    // Add Device Usage sheet
    const devicesSheet = workbook.addWorksheet('Device Usage');
    devicesSheet.columns = [
      { header: 'Device Type', key: 'device', width: 20 },
      { header: 'Count', key: 'count', width: 15 },
      { header: 'Percentage', key: 'percentage', width: 15 }
    ];
    devicesSheet.getRow(1).font = { bold: true };

    // Add device usage data
    deviceData.devices.forEach(device => {
      devicesSheet.addRow({
        device: device.name,
        count: device.value,
        percentage: `${device.percentage}%`
      });
    });
    
    devicesSheet.addRow({});
    devicesSheet.addRow({
      device: 'Total',
      count: deviceData.total
    });

    // Generate file path
    const fileName = `analytics_dashboard_${timeRange}days_${uuid()}.xlsx`;
    const filePath = path.join(this.exportsDir, fileName);

    // Write file
    await workbook.xlsx.writeFile(filePath);

    return {
      fileName,
      filePath,
      timeRange
    };
  }

  async generateCsvReport(reportType: string, timeRange = 30): Promise<ExportResult> {
    let data: any;
    let fileName: string;
    let headerRow: string;

    switch (reportType) {
      case 'users':
        data = await this.getUserGrowthAnalytics(timeRange);
        fileName = `user_growth_${timeRange}days_${uuid()}.csv`;
        headerRow = 'Period,New Users,Active Users\n';
        break;
      case 'revenue':
        data = await this.getRevenueAnalytics();
        fileName = `revenue_${data.year}_${uuid()}.csv`;
        headerRow = 'Month,Revenue,Expenses,Profit\n';
        break;
      case 'features':
        data = await this.getFeatureUsageAnalytics(timeRange);
        fileName = `feature_usage_${timeRange}days_${uuid()}.csv`;
        headerRow = 'Feature,Usage Count\n';
        break;
      case 'sources':
        data = await this.getUserSourceAnalytics(timeRange);
        fileName = `user_sources_${timeRange}days_${uuid()}.csv`;
        headerRow = 'Source,Count,Percentage\n';
        break;
      case 'devices':
        data = await this.getDeviceAnalytics(timeRange);
        fileName = `device_usage_${timeRange}days_${uuid()}.csv`;
        headerRow = 'Device,Count,Percentage\n';
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    const filePath = path.join(this.exportsDir, fileName);
    let csvContent = headerRow;

    // Generate CSV content based on report type
    if (reportType === 'users') {
      data.labels.forEach((label: string, index: number) => {
        csvContent += `${label},${data.datasets[0].data[index]},${data.datasets[1].data[index]}\n`;
      });
    } else if (reportType === 'revenue') {
      data.labels.forEach((label: string, index: number) => {
        const revenue = data.datasets[0].data[index];
        const expenses = data.datasets[1].data[index];
        const profit = revenue - expenses;
        csvContent += `${label},${revenue},${expenses},${profit}\n`;
      });
    } else if (reportType === 'features') {
      data.labels.forEach((label: string, index: number) => {
        csvContent += `${label},${data.datasets[0].data[index]}\n`;
      });
    } else if (reportType === 'sources') {
      data.sources.forEach((source: SourceData) => {
        csvContent += `${source.name},${source.value},${source.percentage}%\n`;
      });
    } else if (reportType === 'devices') {
      data.devices.forEach((device: DeviceData) => {
        csvContent += `${device.name},${device.value},${device.percentage}%\n`;
      });
    }

    // Write to file
    fs.writeFileSync(filePath, csvContent);

    return {
      fileName,
      filePath,
      reportType,
      timeRange
    };
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private formatSessionTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  private async getUserCount(startDate: Date, endDate: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });
  }

  private async getActiveUserCount(startDate: Date, endDate: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        lastSeenAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });
  }

  private async getRevenue(startDate: Date, endDate: Date): Promise<number> {
    // In a real app, you'd query your subscription/payment records
    const premiumUsers = await this.prisma.userSubscription.count({
      where: {
        plan: 'PREMIUM',
        isActive: true,
        startDate: {
          lte: endDate
        },
        OR: [
          { endDate: null },
          { endDate: { gt: startDate } }
        ]
      }
    });

    // Assuming $49.99 per premium user
    return Math.round(premiumUsers * 49.99 * 100) / 100;
  }

  private async getAverageSessionTime(startDate: Date, endDate: Date): Promise<number> {
    // In a real app, you'd have a sessions table or use analytics integration
    // Returning a placeholder value (in seconds)
    return 744; // 12m 24s in seconds
  }

  private async getUserActivity(days: number): Promise<any> {
    const labels: string[] = [];
    const activeUsersData: number[] = [];
    const newUsersData: number[] = [];

    // Generate date labels and fetch data for each day
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
      labels.push(dateStr);
      
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      // Count active users for this day
      const activeUsers = await this.prisma.user.count({
        where: {
          lastSeenAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });
      
      // Count new users for this day
      const newUsers = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });
      
      activeUsersData.push(activeUsers);
      newUsersData.push(newUsers);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Active Users',
          data: activeUsersData
        },
        {
          label: 'New Users',
          data: newUsersData
        }
      ]
    };
  }

  private async getRevenueOverview(): Promise<any> {
    return this.getRevenueAnalytics();
  }

  private async getFeatureUsage(startDate: Date, endDate: Date): Promise<any> {
    return this.getFeatureUsageAnalytics(30);
  }

  private async getTrafficSources(startDate: Date, endDate: Date): Promise<any> {
    return (await this.getUserSourceAnalytics(30)).sources;
  }

  private async getDeviceBreakdown(startDate: Date, endDate: Date): Promise<any> {
    return (await this.getDeviceAnalytics(30)).devices;
  }

  private generateDatePeriods(startDate: Date, endDate: Date, groupBy = 'day'): DatePeriod[] {
    const periods: DatePeriod[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      let key: string, label: string;
      
      switch(groupBy) {
        case 'week': {
          // Get ISO week
          const firstDay = new Date(currentDate.getFullYear(), 0, 1);
          const weekNum = Math.ceil(
            (((currentDate.getTime() - firstDay.getTime()) / 86400000) + firstDay.getDay() + 1) / 7
          );
          key = `${currentDate.getFullYear()}-W${weekNum}`;
          label = `W${weekNum}`;
          
          // Advance to next week
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        }
        case 'month': {
          key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
          label = currentDate.toLocaleString('default', { month: 'short' });
          
          // Advance to next month
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
          break;
        }
        case 'quarter': {
          const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
          key = `${currentDate.getFullYear()}-Q${quarter}`;
          label = `Q${quarter} ${currentDate.getFullYear()}`;
          
          // Advance to next quarter
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 1);
          break;
        }
        case 'year': {
          key = `${currentDate.getFullYear()}`;
          label = key;
          
          // Advance to next year
          currentDate = new Date(currentDate.getFullYear() + 1, 0, 1);
          break;
        }
        default: { // day
          key = currentDate.toISOString().split('T')[0];
          label = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
          
          // Advance to next day
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      periods.push({ key, label });
    }
    
    return periods;
  }
}