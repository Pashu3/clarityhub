import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadStatus } from '@prisma/client';
import { CreateLeadDto, UpdateLeadDto, CreateInteractionDto } from './dto';
import { subDays, subMonths } from 'date-fns';

interface LeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  source?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLeadDto, userId: string) {
    return this.prisma.lead.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAllForAdmin(filters: LeadFilters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      source,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const totalCount = await this.prisma.lead.count({ where });

    const leads = await this.prisma.lead.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: { interactions: true }
        }
      },
      orderBy,
      skip,
      take: limit,
    });

    return {
      data: leads,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      }
    };
  }

  async findOneForAdmin(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async updateForAdmin(id: string, data: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    const statusChanged = data.status && lead.status !== data.status;
    if (statusChanged) {
      data.lastContactAt = new Date();
    }

    return this.prisma.lead.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async deleteForAdmin(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    await this.prisma.$transaction([
      this.prisma.leadInteraction.deleteMany({
        where: { leadId: id },
      }),
      this.prisma.lead.delete({
        where: { id },
      }),
    ]);

    return { success: true, message: 'Lead deleted successfully' };
  }

  async addInteractionForAdmin(leadId: string, data: CreateInteractionDto, adminId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    const interaction = await this.prisma.leadInteraction.create({
      data: {
        ...data,
        leadId,
        createdBy: adminId,
      },
    });

    if (data.completedAt) {
      await this.prisma.lead.update({
        where: { id: leadId },
        data: { 
          lastContactAt: data.completedAt,
        },
      });
    }

    return interaction;
  }

  async getLeadAnalytics(timeframe: 'week' | 'month' | 'quarter' = 'month') {
    const now = new Date();
    let currentStart: Date, previousStart: Date;
    
    if (timeframe === 'week') {
      currentStart = subDays(now, 7);
      previousStart = subDays(currentStart, 7);
    } else if (timeframe === 'month') {
      currentStart = subMonths(now, 1);
      previousStart = subMonths(currentStart, 1);
    } else {
      currentStart = subMonths(now, 3);
      previousStart = subMonths(currentStart, 3);
    }
    
    const currentLeads = await this.prisma.lead.findMany({
      where: {
        createdAt: {
          gte: currentStart,
        },
      },
      include: {
        interactions: true,
      },
    });
    
    const previousLeads = await this.prisma.lead.findMany({
      where: {
        createdAt: {
          gte: previousStart,
          lt: currentStart,
        },
      },
    });
    
    const currentQualified = currentLeads.filter(
      lead => ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON'].includes(lead.status)
    );
    
    const previousQualified = previousLeads.filter(
      lead => ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON'].includes(lead.status)
    );
    
    const currentClosedWon = currentLeads.filter(
      lead => lead.status === 'CLOSED_WON'
    );
    
    const currentConversionRate = currentLeads.length > 0 
      ? (currentClosedWon.length / currentLeads.length) * 100
      : 0;
      
    const previousConversionRate = previousLeads.length > 0
      ? (previousLeads.filter(lead => lead.status === 'CLOSED_WON').length / previousLeads.length) * 100
      : 0;
    
    const currentAvgValue = currentClosedWon.length > 0
      ? currentClosedWon.reduce((sum, lead) => sum + (lead.value || 0), 0) / currentClosedWon.length
      : 0;
      
    const previousAvgValue = previousLeads.filter(lead => lead.status === 'CLOSED_WON').length > 0
      ? previousLeads
          .filter(lead => lead.status === 'CLOSED_WON')
          .reduce((sum, lead) => sum + (lead.value || 0), 0) / 
          previousLeads.filter(lead => lead.status === 'CLOSED_WON').length
      : 0;
    
    const totalLeadsChange = previousLeads.length > 0
      ? ((currentLeads.length - previousLeads.length) / previousLeads.length) * 100
      : 0;
      
    const qualifiedLeadsChange = previousQualified.length > 0
      ? ((currentQualified.length - previousQualified.length) / previousQualified.length) * 100
      : 0;
      
    const conversionRateChange = previousConversionRate > 0
      ? currentConversionRate - previousConversionRate
      : 0;
      
    const avgValueChange = previousAvgValue > 0
      ? ((currentAvgValue - previousAvgValue) / previousAvgValue) * 100
      : 0;
    
    return {
      totalLeads: {
        value: currentLeads.length,
        change: totalLeadsChange.toFixed(0),
        trend: totalLeadsChange >= 0 ? 'up' : 'down',
      },
      qualifiedLeads: {
        value: currentQualified.length,
        change: qualifiedLeadsChange.toFixed(0),
        trend: qualifiedLeadsChange >= 0 ? 'up' : 'down',
      },
      conversionRate: {
        value: currentConversionRate.toFixed(1),
        change: conversionRateChange.toFixed(1),
        trend: conversionRateChange >= 0 ? 'up' : 'down',
      },
      avgDealValue: {
        value: currentAvgValue.toFixed(0),
        change: avgValueChange.toFixed(0),
        trend: avgValueChange >= 0 ? 'up' : 'down',
      },
      leadsBySource: this.calculateLeadsBySource(currentLeads),
      leadsByStatus: this.calculateLeadsByStatus(currentLeads),
      interactionCount: currentLeads.reduce((sum, lead) => sum + lead.interactions.length, 0),
      recentLeads: currentLeads
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map(lead => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          status: lead.status,
          value: lead.value,
          createdAt: lead.createdAt,
        })),
    };
  }

  async getAdminDashboardStats() {
    const totalLeadCount = await this.prisma.lead.count();
    
    const statusCounts = await this.prisma.lead.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });
    
    const sourceCounts = await this.prisma.lead.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });
    
    const recentInteractions = await this.prisma.leadInteraction.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    const upcomingInteractions = await this.prisma.leadInteraction.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
        completedAt: null,
      },
      take: 5,
      orderBy: {
        scheduledAt: 'asc',
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    const highValueLeads = await this.prisma.lead.findMany({
      where: {
        value: {
          not: null,
        },
      },
      orderBy: {
        value: 'desc',
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        value: true,
      },
    });
    
    return {
      totalLeadCount,
      leadsByStatus: statusCounts.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      leadsBySource: sourceCounts.map(item => ({
        source: item.source,
        count: item._count.id,
      })),
      recentInteractions,
      upcomingInteractions,
      highValueLeads,
    };
  }

  async getUsersWithLeadCounts() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            leads: true,
          },
        },
        lastLoginAt: true,
        lastSeenAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      leadCount: user._count.leads,
      lastLoginAt: user.lastLoginAt,
      lastSeenAt: user.lastSeenAt,
    }));
  }

  private calculateLeadsBySource(leads) {
    const sourceCount = {};
    leads.forEach(lead => {
      sourceCount[lead.source] = (sourceCount[lead.source] || 0) + 1;
    });
    
    return Object.entries(sourceCount).map(([source, count]) => ({
      source,
      count,
      percentage: leads.length > 0 ? ((count as number) / leads.length) * 100 : 0,
    }));
  }

  private calculateLeadsByStatus(leads) {
    const statusCount = {};
    leads.forEach(lead => {
      statusCount[lead.status] = (statusCount[lead.status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: leads.length > 0 ? ((count as number) / leads.length) * 100 : 0,
    }));
  }
}