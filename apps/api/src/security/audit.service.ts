import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(data: {
    userId: string;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const auditData: any = {
      userId: data.userId,
      action: data.action,
      resource: data.resource,
    };
    
    if (data.details !== undefined) {
      auditData.details = data.details;
    }
    
    if (data.ipAddress !== undefined) {
      auditData.ipAddress = data.ipAddress;
    }
    
    if (data.userAgent !== undefined) {
      auditData.userAgent = data.userAgent;
    }
    
    return this.prisma.auditLog.create({
      data: auditData,
    });
  }

  
  async logLoginAttempt(data: {
    userId?: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    status: 'Success' | 'Failed';
    reason?: string;
    location?: string;
    device?: string;
  }) {
    const loginData: any = {
      email: data.email,
      status: data.status,
      userAgent: data.userAgent || 'Unknown',  
      ipAddress: data.ipAddress || 'Unknown', 
    };
    
    if (data.userId) loginData.userId = data.userId;
    if (data.reason) loginData.reason = data.reason;
    if (data.location) loginData.location = data.location;
    if (data.device) loginData.device = data.device;
    
    return this.prisma.loginAttempt.create({
      data: loginData,
    });
  }
  
  async logActivity(data: {
    action: string;
    description: string;
    userId: string;
    ipAddress?: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: any;
  }) {
    return this.createAuditLog({
      userId: data.userId,
      action: data.action,
      resource: data.resourceType || 'unknown',
      details: {
        description: data.description,
        resourceId: data.resourceId,
        metadata: data.metadata
      },
      ipAddress: data.ipAddress,
      userAgent: undefined
    });
  }
  
  async createSecurityAlert(data: {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    type: string;
    status: 'Active' | 'Investigating' | 'Resolved' | 'False Positive';
    message: string;
    details?: string;
    userId?: string;
    ipAddress?: string;
    location?: string;
  }) {
    const alertData: any = {
      severity: data.severity,
      type: data.type, 
      status: data.status,
      message: data.message
    };
    
    if (data.details) alertData.details = data.details;
    if (data.userId) alertData.userId = data.userId;
    if (data.ipAddress) alertData.ipAddress = data.ipAddress;
    if (data.location) alertData.location = data.location;
    
    return this.prisma.securityAlert.create({
      data: alertData
    });
  }

  async getAuditLogs(params: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }) {
    const { userId, action, resource, startDate, endDate, skip = 0, take = 50 } = params;
    
    const where: any = {};
    
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }
    
    const [results, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    
    return {
      results,
      total,
      skip,
      take,
    };
  }
}