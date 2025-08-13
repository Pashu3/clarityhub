import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class SecurityService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getDashboardOverview(days: number = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    // Get security score components
    const mfaAdminUsers = await this.prisma.user.count({
      where: {
        role: { in: ['ADMIN', 'SUPERADMIN'] },
        mfaEnabled: true,
      },
    });

    const totalAdminUsers = await this.prisma.user.count({
      where: {
        role: { in: ['ADMIN', 'SUPERADMIN'] },
      },
    });

    // Count metrics
    const failedLogins = await this.prisma.loginAttempt.count({
      where: {
        status: 'Failed',
        createdAt: { gte: date },
      },
    });

    const previousFailedLogins = await this.prisma.loginAttempt.count({
      where: {
        status: 'Failed',
        createdAt: {
          gte: new Date(date.getTime() - days * 24 * 60 * 60 * 1000),
          lt: date,
        },
      },
    });

    const activeSessions = await this.prisma.userSession.count({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    const previousActiveSessions = await this.prisma.userSession.count({
      where: {
        createdAt: {
          gte: new Date(date.getTime() - days * 24 * 60 * 60 * 1000),
          lt: date,
        },
        expiresAt: { gt: new Date(date.getTime() - days * 24 * 60 * 60 * 1000) },
      },
    });

    const activeAlerts = await this.prisma.securityAlert.count({
      where: {
        status: { in: ['Active', 'Investigating'] },
      },
    });

    const previousActiveAlerts = await this.prisma.securityAlert.count({
      where: {
        createdAt: {
          gte: new Date(date.getTime() - days * 24 * 60 * 60 * 1000),
          lt: date,
        },
        status: { in: ['Active', 'Investigating'] },
      },
    });

    // Get security score (based on various factors)
    const securityScoreBase = 70; // Base score
    const mfaScore = totalAdminUsers > 0 ? Math.round((mfaAdminUsers / totalAdminUsers) * 20) : 20;
    const alertScore = activeAlerts === 0 ? 10 : Math.max(0, 10 - activeAlerts * 2);
    const securityScore = Math.min(100, securityScoreBase + mfaScore + alertScore);

    // Get latest recommendations
    const recommendations = await this.prisma.securityRecommendation.findMany({
      take: 4,
      orderBy: {
        priority: 'desc',
      },
    });

    // Get recent alerts
    const recentAlerts = await this.prisma.securityAlert.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return {
      securityScore: {
        current: securityScore,
        change: 5, // Placeholder - would need to calculate based on history
      },
      metrics: {
        activeAlerts: {
          count: activeAlerts,
          change: activeAlerts - previousActiveAlerts,
        },
        failedLogins: {
          count: failedLogins,
          change: failedLogins - previousFailedLogins,
        },
        activeSessions: {
          count: activeSessions,
          change: activeSessions - previousActiveSessions,
        },
      },
      recommendations,
      recentAlerts: recentAlerts.map(alert => ({
        ...alert,
        userEmail: alert.user?.email,
      })),
    };
  }

  async getLoginAttempts({ page = 1, limit = 10, status, search }) {
    const skip = (page - 1) * limit;
    
    let where = {};
    
    if (status) {
      where = {
        ...where,
        status,
      };
    }
    
    if (search) {
      where = {
        ...where,
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { ipAddress: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [loginAttempts, total] = await Promise.all([
      this.prisma.loginAttempt.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.loginAttempt.count({ where }),
    ]);

    return {
      data: loginAttempts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getActiveSessions() {
    const activeSessions = await this.prisma.userSession.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return activeSessions.map(session => ({
      id: session.id,
      userId: session.userId,
      email: session.user.email,
      ipAddress: session.ipAddress,
      device: session.device,
      location: session.location,
      type: session.type,
      startedAt: session.createdAt,
      lastActivity: session.lastActivityAt,
    }));
  }

  async terminateSession(sessionId: string, userId: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
  
    if (!session) {
      throw new NotFoundException('Session not found');
    }
  
    // Check if admin is terminating their own session or has permissions
    const adminUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
  
    // Add null check for adminUser
    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }
  
    if (session.userId !== userId && adminUser.role !== 'SUPERADMIN') {
      throw new ForbiddenException('You do not have permission to terminate this session');
    }
  
    await this.prisma.userSession.delete({
      where: { id: sessionId },
    });
  
    // Log to audit trail (FIXED)
    await this.auditService.createAuditLog({
      userId,
      action: 'Session terminated',
      resource: 'sessions',
      details: {
        sessionId,
        userEmail: session.user?.email,
        terminationType: 'manual'
      },
      ipAddress: undefined,  // Changed from null
      userAgent: undefined   // Changed from null
    });
  
    return { success: true };
  }

  async terminateAllSessions(userId: string) {
    // Only allow terminating all sessions for admins
    const adminUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
  
    // Add null check for adminUser
    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }
  
    if (adminUser.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Only super admins can terminate all sessions');
    }
  
    // Keep current session
    const currentSession = await this.prisma.userSession.findFirst({
      where: { userId },
      orderBy: { lastActivityAt: 'desc' },
    });
  
    // Add null check for currentSession
    if (!currentSession) {
      throw new NotFoundException('No active session found for this user');
    }
  
    // Delete all other sessions
    await this.prisma.userSession.deleteMany({
      where: {
        id: { not: currentSession.id },
      },
    });
  
    // Log to audit trail (FIXED)
    await this.auditService.createAuditLog({
      userId,
      action: 'All sessions terminated',
      resource: 'sessions',
      details: {
        terminationType: 'bulk',
        description: 'All user sessions were terminated by admin'
      },
      ipAddress: currentSession.ipAddress || undefined,  // Changed from null
      userAgent: undefined  // Changed from null
    });
    return { success: true };
  }

  async getAuditLog({ page = 1, limit = 10, action, search }) {
    const skip = (page - 1) * limit;
    
    let where = {};
    
    if (action) {
      where = {
        ...where,
        action,
      };
    }
    
    if (search) {
      where = {
        ...where,
        OR: [
          { description: { contains: search, mode: 'insensitive' } },
          { 
            user: {
              email: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      };
    }

    const [auditLogs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: auditLogs.map(log => ({
        ...log,
        userEmail: log.user?.email || 'System',
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSecuritySettings() {
    // Get or create security settings
    let settings = await this.prisma.securitySettings.findFirst();
    
    if (!settings) {
      settings = await this.prisma.securitySettings.create({
        data: {} // Uses defaults from schema
      });
    }
    
    return settings;
  }

  async updateSecuritySettings(settingsData, userId: string) {
    // Get existing settings
    let currentSettings = await this.prisma.securitySettings.findFirst();
    
    if (!currentSettings) {
      currentSettings = await this.prisma.securitySettings.create({
        data: {} // Uses defaults from schema
      });
    }
    
    // Update settings
    const updatedSettings = await this.prisma.securitySettings.update({
      where: { id: currentSettings.id },
      data: {
        ...settingsData,
        updatedAt: new Date(),
      },
    });
    
    // Log changes to audit trail (FIXED)
    await this.auditService.createAuditLog({
      userId,
      action: 'Security settings updated',
      resource: 'security-settings',
      details: {
        id: updatedSettings.id,
        before: currentSettings,
        after: updatedSettings
      },
      ipAddress: undefined,  // Changed from null
      userAgent: undefined   // Changed from null
    });
    
    
    return updatedSettings;
  }

  async getSecurityAlerts(status?: string) {
    const where = status ? { status } : {};
    
    return this.prisma.securityAlert.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async updateAlertStatus(alertId: string, status: string, userId: string) {
    const alert = await this.prisma.securityAlert.findUnique({
      where: { id: alertId },
    });
    
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }
    
    const updatedAlert = await this.prisma.securityAlert.update({
      where: { id: alertId },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === 'Resolved' ? { 
          resolvedAt: new Date(),
          resolvedById: userId,
        } : {}),
      },
    });
    
    // Log to audit trail (FIXED)
    await this.auditService.createAuditLog({
      userId,
      action: 'Security alert updated',
      resource: 'security-alerts',
      details: {
        alertId,
        newStatus: status,
        description: `Alert status changed to ${status}`
      },
      ipAddress: undefined,  // Changed from null
      userAgent: undefined   // Changed from null
    });
    
    return updatedAlert;
  }

  async getRecommendations() {
    return this.prisma.securityRecommendation.findMany({
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
      ],
    });
  }

  async updateRecommendationStatus(id: string, status: string, userId: string) {
    const recommendation = await this.prisma.securityRecommendation.findUnique({
      where: { id },
    });
    
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    
    const updatedRecommendation = await this.prisma.securityRecommendation.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === 'Completed' ? { completedAt: new Date() } : {}),
      },
    });
    
    // Log to audit trail (FIXED)
    await this.auditService.createAuditLog({
      userId,
      action: 'Recommendation status updated',
      resource: 'security-recommendations',
      details: {
        id,
        title: recommendation.title,
        newStatus: status,
        description: `Recommendation "${recommendation.title}" status changed to ${status}`
      },
      ipAddress: undefined,  // Changed from null
      userAgent: undefined   // Changed from null
    });
    
    return updatedRecommendation;
  }
}