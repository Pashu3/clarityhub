import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { TicketStatus, TicketPriority, Role } from '@prisma/client';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService
  ) {}

  async getSupportDashboard(days: number = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    // Get open tickets count
    const openTickets = await this.prisma.supportTicket.count({
      where: {
        status: { in: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.WAITING_ON_CUSTOMER] },
      }
    });
    
    // Get new tickets in last X days
    const newTickets = await this.prisma.supportTicket.count({
      where: {
        createdAt: { gte: date }
      }
    });
    
    // Get previous period for comparison
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - days);
    
    const previousNewTickets = await this.prisma.supportTicket.count({
      where: {
        createdAt: { 
          gte: previousDate,
          lt: date
        }
      }
    });

    // Calculate average response time for tickets created in the last X days
    const ticketsWithResponses = await this.prisma.supportTicket.findMany({
      where: {
        createdAt: { gte: date },
        responses: { some: {} }
      },
      include: {
        responses: {
          orderBy: { createdAt: 'asc' },
          take: 1,
          where: {
            isInternal: false
          }
        }
      }
    });

    let totalResponseTime = 0;
    let countWithResponses = 0;
    
    ticketsWithResponses.forEach(ticket => {
      if (ticket.responses.length > 0) {
        const responseTime = ticket.responses[0].createdAt.getTime() - ticket.createdAt.getTime();
        totalResponseTime += responseTime;
        countWithResponses++;
      }
    });
    
    const avgResponseTime = countWithResponses > 0 ? 
      Math.round(totalResponseTime / countWithResponses / 1000 / 60) : 0; // in minutes
    
    // Calculate KB views
    const kbViews = await this.prisma.content.aggregate({
      _sum: { views: true },
      where: {
        type: 'DOCUMENTATION',
        updatedAt: { gte: date }
      }
    });

    // Get recent tickets for dashboard
    const recentTickets = await this.prisma.supportTicket.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true
          }
        },
        assignedTo: {
          select: {
            email: true
          }
        }
      }
    });

    // Get popular KB articles
    const popularArticles = await this.prisma.content.findMany({
      take: 6,
      orderBy: { views: 'desc' },
      where: {
        type: { in: ['DOCUMENTATION', 'ARTICLE', 'FAQ'] }
      }
    });

    return {
      metrics: {
        openTickets: {
          count: openTickets,
          change: 0 // You would calculate this based on historical data
        },
        newTickets: {
          count: newTickets,
          change: newTickets - previousNewTickets
        },
        avgResponseTime: {
          minutes: avgResponseTime,
          change: 0 // You would calculate this based on historical data
        },
        customerSatisfaction: {
          percentage: 94, // Placeholder - would come from actual ratings
          change: 2 // Placeholder
        },
        kbViews: {
          count: kbViews._sum.views || 0,
          change: 420 // Placeholder
        }
      },
      recentTickets: recentTickets.map(ticket => ({
        id: ticket.id,
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        userEmail: ticket.user.email,
        assignedTo: ticket.assignedTo?.email || null
      })),
      popularArticles: popularArticles.map(article => ({
        id: article.id,
        title: article.title,
        category: article.category,
        views: article.views,
        updatedAt: article.updatedAt
      }))
    };
  }

  async getTickets(params: {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: string;
    search?: string;
    userId?: string;
    assignedToId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      search,
      userId,
      assignedToId
    } = params;

    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (assignedToId) {
      where.assignedToId = assignedToId;
    }
    
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ticketId: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          _count: {
            select: {
              responses: true,
              attachments: true
            }
          }
        }
      }),
      this.prisma.supportTicket.count({ where })
    ]);
    
    return {
      data: tickets.map(ticket => ({
        id: ticket.id,
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        user: {
          id: ticket.user.id,
          email: ticket.user.email
        },
        assignedTo: ticket.assignedTo ? {
          id: ticket.assignedTo.id,
          email: ticket.assignedTo.email,
          name: ticket.assignedTo.name
        } : null,
        responsesCount: ticket._count.responses,
        attachmentsCount: ticket._count.attachments
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getTicketById(ticketId: string, userId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        responses: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true
              }
            },
            attachments: true
          }
        },
        attachments: true
      }
    });
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    
    // Check if user is allowed to view this ticket
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN;
    const isOwner = ticket.userId === userId;
    const isAssigned = ticket.assignedToId === userId;
    
    if (!isAdmin && !isOwner && !isAssigned) {
      throw new ForbiddenException('You do not have permission to view this ticket');
    }
    
    // Filter out internal notes for regular users
    const filteredResponses = isAdmin || isAssigned ? 
      ticket.responses : 
      ticket.responses.filter(response => !response.isInternal);
    
    return {
      ...ticket,
      responses: filteredResponses
    };
  }

  async createTicket(data: CreateTicketDto, userId: string) {
    // Generate unique ticket ID (T-XXXX format)
    const lastTicket = await this.prisma.supportTicket.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    let ticketNumber = 1000;
    if (lastTicket && lastTicket.ticketId) {
      const lastNumber = parseInt(lastTicket.ticketId.split('-')[1]);
      if (!isNaN(lastNumber)) {
        ticketNumber = lastNumber + 1;
      }
    }
    
    const ticketId = `T-${ticketNumber}`;
    
    // Create the ticket
    const newTicket = await this.prisma.supportTicket.create({
      data: {
        ticketId,
        subject: data.subject,
        description: data.description,
        priority: data.priority || TicketPriority.MEDIUM,
        category: data.category || 'GENERAL',
        userId,
        // Handle attachments if any
        ...(data.attachmentIds && data.attachmentIds.length > 0 ? {
          attachments: {
            connect: data.attachmentIds.map(id => ({ id }))
          }
        } : {})
      }
    });
    
    // Get support settings to check for auto-acknowledgment
    const settings = await this.prisma.supportSettings.findFirst();
    
    if (settings?.autoAcknowledgment) {
      // Create auto-response
      await this.prisma.ticketResponse.create({
        data: {
          content: `Thank you for contacting support. Your ticket (${ticketId}) has been received and will be reviewed shortly.`,
          isInternal: false,
          ticketId: newTicket.id,
          userId: userId // System user would be better here
        }
      });
    }
    
    // TODO: Auto-assignment logic based on settings
    
    return newTicket;
  }

  async updateTicket(id: string, data: UpdateTicketDto, userId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    
    // Check if user has permission to update this ticket
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN;
    const isAssigned = ticket.assignedToId === userId;
    
    if (!isAdmin && !isAssigned) {
      throw new ForbiddenException('You do not have permission to update this ticket');
    }
    
    // Handle status changes specifically
    const updateData: any = { ...data };
    
    if (data.status === TicketStatus.RESOLVED && ticket.status !== TicketStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
    }
    
    if (data.status === TicketStatus.CLOSED && ticket.status !== TicketStatus.CLOSED) {
      updateData.closedAt = new Date();
    }
    
    return this.prisma.supportTicket.update({
      where: { id },
      data: updateData
    });
  }

  async addResponse(ticketId: string, data: TicketResponseDto, userId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    
    // Check if user has permission to respond to this ticket
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });
    
    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN;
    const isOwner = ticket.userId === userId;
    const isAssigned = ticket.assignedToId === userId;
    
    // Only staff can add internal notes
    if (data.isInternal && !isAdmin && !isAssigned) {
      throw new ForbiddenException('Only staff can add internal notes');
    }
    
    // Regular users can only respond to their own tickets
    if (!isAdmin && !isOwner && !isAssigned) {
      throw new ForbiddenException('You do not have permission to respond to this ticket');
    }
    
    // Create the response
    const response = await this.prisma.ticketResponse.create({
      data: {
        content: data.content,
        isInternal: data.isInternal || false,
        ticketId,
        userId,
        // Handle attachments if any
        ...(data.attachmentIds && data.attachmentIds.length > 0 ? {
          attachments: {
            connect: data.attachmentIds.map(id => ({ id }))
          }
        } : {})
      }
    });
    
    // Update ticket status based on who responded
    let newStatus = ticket.status;
    
    if (isOwner) {
      // Customer responded
      newStatus = TicketStatus.OPEN;
    } else if (isAdmin || isAssigned) {
      // Staff responded
      if (!data.isInternal) {
        newStatus = TicketStatus.WAITING_ON_CUSTOMER;
      }
    }
    
    if (newStatus !== ticket.status) {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: newStatus }
      });
    }
    
    return response;
  }

  async getSupportSettings() {
    let settings = await this.prisma.supportSettings.findFirst();
    
    if (!settings) {
      settings = await this.prisma.supportSettings.create({
        data: {} // Uses defaults from schema
      });
    }
    
    return settings;
  }

  async updateSupportSettings(data: any, userId: string) {
    // Check if user is an admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    if (user?.role !== Role.ADMIN && user?.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('Only administrators can update support settings');
    }
    
    // Get or create settings
    let settings = await this.prisma.supportSettings.findFirst();
    
    if (!settings) {
      settings = await this.prisma.supportSettings.create({
        data: {} // Uses defaults from schema
      });
    }
    
    // Update settings
    return this.prisma.supportSettings.update({
      where: { id: settings.id },
      data
    });
  }

  async getCannedResponses(userId: string) {
    // Check if user has permission
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    if (user?.role !== Role.ADMIN && user?.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('Only administrators can access canned responses');
    }
    
    return this.prisma.cannedResponse.findMany({
      orderBy: { title: 'asc' }
    });
  }
}