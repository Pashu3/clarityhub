import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
    Delete,
    Put,
  } from '@nestjs/common';
  import { SecurityService } from './security.service';
  import { JwtAuthGuard } from '../auth/jwt.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
  import { Role } from '@prisma/client';
  
  @ApiTags('Security')
  @ApiBearerAuth()
  @Controller('security')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  export class SecurityController {
    constructor(private readonly securityService: SecurityService) {}
  
    // Dashboard overview
    @Get('dashboard')
    @ApiOperation({ summary: 'Get security dashboard overview' })
    @ApiQuery({ name: 'days', required: false, type: Number, description: 'Days of data to retrieve (7, 30, or all)' })
    async getDashboard(@Query('days') days: number = 7) {
      return this.securityService.getDashboardOverview(days);
    }
  
    // Login attempts
    @Get('login-attempts')
    @ApiOperation({ summary: 'Get login attempts' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status (Success, Failed)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by email or IP' })
    async getLoginAttempts(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('status') status?: string,
      @Query('search') search?: string,
    ) {
      return this.securityService.getLoginAttempts({ page, limit, status, search });
    }
  
    // Active sessions
    @Get('active-sessions')
    @ApiOperation({ summary: 'Get active sessions' })
    async getActiveSessions() {
      return this.securityService.getActiveSessions();
    }
  
    @Delete('active-sessions/:sessionId')
    @ApiOperation({ summary: 'Terminate a specific session' })
    @ApiParam({ name: 'sessionId', type: String })
    async terminateSession(@Param('sessionId') sessionId: string, @Req() req) {
      return this.securityService.terminateSession(sessionId, req.user.sub);
    }
  
    @Delete('active-sessions')
    @ApiOperation({ summary: 'Terminate all sessions' })
    async terminateAllSessions(@Req() req) {
      return this.securityService.terminateAllSessions(req.user.sub);
    }
  
    // Audit log
    @Get('audit-log')
    @ApiOperation({ summary: 'Get audit log entries' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'action', required: false, type: String, description: 'Filter by action type' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by user or details' })
    async getAuditLog(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('action') action?: string,
      @Query('search') search?: string,
    ) {
      return this.securityService.getAuditLog({ page, limit, action, search });
    }
  
    // Security settings
    @Get('settings')
    @ApiOperation({ summary: 'Get security settings' })
    async getSecuritySettings() {
      return this.securityService.getSecuritySettings();
    }
  
    @Put('settings')
    @ApiOperation({ summary: 'Update security settings' })
    @Roles(Role.SUPERADMIN) // Only super admins can change security settings
    async updateSecuritySettings(@Body() settings: any, @Req() req) {
      return this.securityService.updateSecuritySettings(settings, req.user.sub);
    }
  
    // Security alerts
    @Get('alerts')
    @ApiOperation({ summary: 'Get security alerts' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status (Active, Investigating, Resolved)' })
    async getSecurityAlerts(@Query('status') status?: string) {
      return this.securityService.getSecurityAlerts(status);
    }
  
    @Put('alerts/:alertId')
    @ApiOperation({ summary: 'Update security alert status' })
    @ApiParam({ name: 'alertId', type: String })
    async updateAlertStatus(
      @Param('alertId') alertId: string,
      @Body() data: { status: string },
      @Req() req
    ) {
      return this.securityService.updateAlertStatus(alertId, data.status, req.user.sub);
    }
  
    // Security recommendations
    @Get('recommendations')
    @ApiOperation({ summary: 'Get security recommendations' })
    async getRecommendations() {
      return this.securityService.getRecommendations();
    }
  
    @Put('recommendations/:id')
    @ApiOperation({ summary: 'Update recommendation status' })
    @ApiParam({ name: 'id', type: String })
    async updateRecommendationStatus(
      @Param('id') id: string,
      @Body() data: { status: string },
      @Req() req
    ) {
      return this.securityService.updateRecommendationStatus(id, data.status, req.user.sub);
    }
  }