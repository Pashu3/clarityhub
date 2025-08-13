import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadUsageService {
  private readonly GUEST_DAILY_LIMIT = 1;  // Guest users get 1 upload per day
  private readonly FREE_USER_DAILY_LIMIT = 1;  // Free authenticated users get 1 upload per day

  constructor(private prisma: PrismaService) {}

  async getUsageByUserId(userId: string, page = 1, limit = 10) {
    const [records, total] = await Promise.all([
      this.prisma.uploadUsage.findMany({
        where: { userId },
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          upload: {
            select: {
              filename: true,
              mimetype: true,
              size: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.uploadUsage.count({ where: { userId } }),
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async getAllUploadUsage(page = 1, limit = 10) {
    const [records, total] = await Promise.all([
      this.prisma.uploadUsage.findMany({
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          upload: {
            select: {
              id: true,
              filename: true,
              status: true,
              mimetype: true,
              size: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.uploadUsage.count(),
    ]);
    
    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUsageByIpAddress(ipAddress: string, page = 1, limit = 10) {
    const [records, total] = await Promise.all([
      this.prisma.uploadUsage.findMany({
        where: { ipAddress, userId: null },
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          upload: {
            select: {
              filename: true,
              mimetype: true,
              size: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.uploadUsage.count({ where: { ipAddress, userId: null } }),
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDailyUploadStats(userId?: string, ipAddress?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (userId) {
      const dailyUploads = await this.prisma.uploadUsage.count({
        where: {
          userId,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      
      return {
        userType: 'registered',
        todayUploads: dailyUploads,
        remaining: 1 - dailyUploads,
      };
    }

    if (ipAddress) {
      const dailyUploads = await this.prisma.uploadUsage.count({
        where: {
          ipAddress,
          userId: null,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      
      return {
        userType: 'guest',
        todayUploads: dailyUploads,
        remaining: 1 - dailyUploads,
      };
    }

    return {
      userType: 'unknown',
      todayUploads: 0,
      remaining: 0,
    };
  }

  async getUploadHistory(userId?: string, ipAddress?: string, page = 1, limit = 10) {
    if (userId) {
      return this.getUsageByUserId(userId, page, limit);
    }
    
    if (ipAddress) {
      return this.getUsageByIpAddress(ipAddress, page, limit);
    }
    
    return {
      records: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async createUsageRecord(fileId: string, userId?: string, ipAddress?: string) {
    return this.prisma.uploadUsage.create({
      data: {
        fileId,
        userId,
        ipAddress: ipAddress || 'unknown',
      },
    });
  }
  
  async getUsageStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Fix the distinct queries
    const uniqueUserIds = await this.prisma.uploadUsage.findMany({
      where: {
        userId: {
          not: null,
        },
      },
      distinct: ['userId'],
      select: { userId: true },
    });
  
    const uniqueGuestIps = await this.prisma.uploadUsage.findMany({
      where: {
        userId: null,
      },
      distinct: ['ipAddress'],
      select: { ipAddress: true },
    });
  
    const [
      totalUploads,
      todayUploads,
      yesterdayUploads,
      weekUploads,
      monthUploads,
    ] = await Promise.all([
      this.prisma.uploadUsage.count(),
      this.prisma.uploadUsage.count({
        where: {
          uploadDate: {
            gte: today,
          },
        },
      }),
      this.prisma.uploadUsage.count({
        where: {
          uploadDate: {
            gte: yesterday,
            lt: today,
          },
        },
      }),
      this.prisma.uploadUsage.count({
        where: {
          uploadDate: {
            gte: lastWeek,
          },
        },
      }),
      this.prisma.uploadUsage.count({
        where: {
          uploadDate: {
            gte: lastMonth,
          },
        },
      }),
    ]);
    
    const uniqueUsers = uniqueUserIds.length;
    const uniqueGuests = uniqueGuestIps.length;
    
    return {
      totalUploads,
      todayUploads,
      yesterdayUploads,
      weekUploads,
      monthUploads,
      uniqueUsers,
      uniqueGuests,
      totalUnique: uniqueUsers + uniqueGuests,
    };
  }

  async checkUploadAllowed(userId?: string, ipAddress?: string, subscription?: any) {
    // Premium users have unlimited uploads
    if (userId && subscription?.plan === 'PREMIUM' && subscription?.isActive) {
      return {
        allowed: true,
        reason: 'PREMIUM_SUBSCRIPTION',
        remaining: 'unlimited',
        message: 'Premium users have unlimited uploads.'
      };
    }
    
    // Check daily limits for users or guests
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // For logged in users (free tier)
    if (userId) {
      const dailyUploads = await this.prisma.uploadUsage.count({
        where: {
          userId,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      
      const remaining = this.FREE_USER_DAILY_LIMIT - dailyUploads;
      
      if (remaining > 0) {
        return {
          allowed: true,
          reason: 'DAILY_FREE_UPLOAD',
          remaining: remaining,
          message: `You have ${remaining} uploads remaining today.`
        };
      }
      
      return {
        allowed: false,
        reason: 'DAILY_LIMIT_REACHED',
        remaining: 0,
        message: 'You have reached your daily upload limit. Upgrade to Premium for unlimited uploads.'
      };
    }
    
    // For guest users
    if (ipAddress) {
      const guestDailyUploads = await this.prisma.uploadUsage.count({
        where: {
          ipAddress,
          userId: null,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      
      const remaining = this.GUEST_DAILY_LIMIT - guestDailyUploads;
      
      if (remaining > 0) {
        return {
          allowed: true,
          reason: 'GUEST_DAILY_FREE_UPLOAD',
          remaining: remaining,
          message: `You have ${remaining} guest uploads remaining today.`
        };
      }
      
      return {
        allowed: false,
        reason: 'GUEST_DAILY_LIMIT_REACHED',
        remaining: 0,
        message: 'You have reached your daily guest upload limit. Sign up or log in for an additional daily upload.'
      };
    }
    
    return {
      allowed: false,
      reason: 'UNKNOWN_USER',
      remaining: 0,
      message: 'Unable to identify user for upload permission.'
    };
  }


  async clearOldGuestRecords(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    // Delete old guest upload usage records
    const result = await this.prisma.uploadUsage.deleteMany({
      where: {
        userId: null,
        uploadDate: {
          lt: cutoffDate,
        },
      },
    });
    
    return {
      deletedCount: result.count,
      message: `Deleted ${result.count} old guest upload records`,
    };
  }
}