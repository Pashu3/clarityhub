import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Req,
  NotFoundException,
  ForbiddenException,
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CannedResponseDto } from './dto/canned-response.dto';
import { SupportSettingsDto } from './dto/support-settings.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { Role, TicketStatus, TicketPriority } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly prisma: PrismaService
  ) {}

  @Get('dashboard')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get support dashboard overview' })
  @ApiResponse({ status: 200, description: 'Returns support dashboard data' })
  getDashboard(@Query('days') days?: number) {
    return this.supportService.getSupportDashboard(days || 7);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiResponse({ status: 200, description: 'Returns list of tickets' })
  getTickets(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('userId') paramUserId?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    // Regular users can only see their own tickets
    const currentUserId = req.user.userId;
    const userRole = req.user.role;
    
    // For non-admin users, force userId filter to be their own ID
    let userId = paramUserId;
    if (userRole !== Role.ADMIN && userRole !== Role.SUPERADMIN) {
      userId = currentUserId;
    }
    
    return this.supportService.getTickets({
      page,
      limit,
      status,
      priority,
      category,
      search,
      userId,
      assignedToId
    });
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200, description: 'Returns ticket details' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  getTicketById(@Param('id') id: string, @Req() req) {
    return this.supportService.getTicketById(id, req.user.userId);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  createTicket(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    return this.supportService.createTicket(createTicketDto, req.user.userId);
  }

  @Put('tickets/:id')
  @ApiOperation({ summary: 'Update ticket' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req
  ) {
    return this.supportService.updateTicket(id, updateTicketDto, req.user.userId);
  }

  @Post('tickets/:id/responses')
  @ApiOperation({ summary: 'Add response to ticket' })
  @ApiResponse({ status: 201, description: 'Response added successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  addResponse(
    @Param('id') id: string,
    @Body() responseDto: TicketResponseDto,
    @Req() req
  ) {
    return this.supportService.addResponse(id, responseDto, req.user.userId);
  }

  @Get('settings')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get support settings' })
  @ApiResponse({ status: 200, description: 'Returns support settings' })
  getSupportSettings() {
    return this.supportService.getSupportSettings();
  }

  @Put('settings')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update support settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  updateSupportSettings(@Body() data: SupportSettingsDto, @Req() req) {
    return this.supportService.updateSupportSettings(data, req.user.userId);
  }
  

  @Get('canned-responses')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get canned responses' })
  @ApiResponse({ status: 200, description: 'Returns list of canned responses' })
  getCannedResponses(@Req() req) {
    return this.supportService.getCannedResponses(req.user.userId);
  }

  @Get('chat/sessions')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get active chat sessions' })
  @ApiResponse({ status: 200, description: 'Returns list of active chat sessions' })
  async getActiveChatSessions() {
    const activeSessions = await this.prisma.liveChatSession.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        agent: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    return activeSessions.map(session => ({
      id: session.id,
      visitorId: session.visitorId,
      visitorName: session.visitorName || 'Unknown Visitor',
      visitorEmail: session.visitorEmail,
      visitorLocation: session.visitorLocation,
      page: session.page,
      status: session.status,
      startedAt: session.startedAt,
      agent: session.agent ? {
        id: session.agent.id,
        email: session.agent.email,
        name: session.agent.name,
      } : null,
      messageCount: session._count.messages,
    }));
  }

  @Get('chat/sessions/:id')
  @ApiOperation({ summary: 'Get chat session details' })
  @ApiResponse({ status: 200, description: 'Returns chat session with messages' })
  @ApiResponse({ status: 404, description: 'Chat session not found' })
  async getChatSession(@Param('id') id: string, @Req() req) {
    // Check if user has permission
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    const chatSession = await this.prisma.liveChatSession.findUnique({
      where: { id },
      include: {
        agent: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    
    if (!chatSession) {
      throw new NotFoundException('Chat session not found');
    }
    
    // Only allow access to admins or the assigned agent
    if (userRole !== Role.ADMIN && userRole !== Role.SUPERADMIN && chatSession.agentId !== userId) {
      throw new ForbiddenException('You do not have permission to access this chat session');
    }
    
    return chatSession;
  }

  @Get('chat/canned-responses')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN) 
  @ApiOperation({ summary: 'Get canned responses for chat' })
  @ApiResponse({ status: 200, description: 'Returns list of canned responses' })
  async getChatCannedResponses() {
    return this.prisma.cannedResponse.findMany({
      where: {
        category: 'LIVE_CHAT',
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  @Post('chat/canned-responses')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create a canned response' })
  @ApiResponse({ status: 201, description: 'Canned response created' })
  async createCannedResponse(@Body() data: CannedResponseDto, @Req() req) {
    return this.prisma.cannedResponse.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category || 'LIVE_CHAT',
        createdBy: req.user.userId,
      },
    });
  }
}