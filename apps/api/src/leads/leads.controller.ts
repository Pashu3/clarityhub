import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, LeadStatus, LeadSource } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLeadDto, UpdateLeadDto, CreateInteractionDto } from './dto';

@ApiTags('Leads') 
@ApiBearerAuth() 
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
// Apply Roles decorator at the controller level to restrict all routes
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead (Admin/SuperAdmin only)' })
  @ApiResponse({ status: 201, description: 'Lead successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  create(@Req() req, @Body() body: CreateLeadDto) {
    return this.leadsService.create(body, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads with filtering options (Admin/SuperAdmin only)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in name, email or phone' })
  @ApiQuery({ name: 'status', required: false, enum: LeadStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'source', required: false, enum: LeadSource, description: 'Filter by source' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'lastContactAt', 'value', 'name'], description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort direction' })
  @ApiResponse({ status: 200, description: 'Returns filtered list of leads' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  findAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: LeadStatus,
    @Query('source') source?: LeadSource,
    @Query('sortBy') sortBy?: 'createdAt' | 'lastContactAt' | 'value' | 'name',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    // No need to check user roles in service since controller is already restricted
    return this.leadsService.findAllForAdmin({
      page,
      limit,
      search,
      status,
      source,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by ID (Admin/SuperAdmin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ status: 200, description: 'Returns lead details with interactions' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  findOne(@Param('id') id: string) {
    // No need to pass user for access control since controller is already restricted
    return this.leadsService.findOneForAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead (Admin/SuperAdmin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  update(@Param('id') id: string, @Body() body: UpdateLeadDto) {
    // No need to pass user for access control since controller is already restricted
    return this.leadsService.updateForAdmin(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead (Admin/SuperAdmin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ status: 200, description: 'Lead deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  delete(@Param('id') id: string) {
    // No need to pass user for access control since controller is already restricted
    return this.leadsService.deleteForAdmin(id);
  }

  @Post(':id/interactions')
  @ApiOperation({ summary: 'Add an interaction to a lead (Admin/SuperAdmin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({ status: 201, description: 'Interaction added successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  addInteraction(
    @Param('id') id: string, 
    @Body() interaction: CreateInteractionDto, 
    @Req() req
  ) {
    return this.leadsService.addInteractionForAdmin(id, interaction, req.user.sub);
  }

  @Get('analytics/summary')
  @ApiOperation({ summary: 'Get lead analytics summary (Admin/SuperAdmin only)' })
  @ApiQuery({ name: 'timeframe', required: false, enum: ['week', 'month', 'quarter'], description: 'Time period for analytics' })
  @ApiResponse({ status: 200, description: 'Returns lead analytics data' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  getAnalyticsSummary(
    @Query('timeframe') timeframe: 'week' | 'month' | 'quarter' = 'month'
  ) {
    return this.leadsService.getLeadAnalytics(timeframe);
  }

  @Get('admin/dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics (Admin/SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin privileges' })
  getDashboardStats() {
    return this.leadsService.getAdminDashboardStats();
  }

  @Get('admin/users-with-leads')
  @ApiOperation({ summary: 'Get users with lead counts (SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'Returns users with lead counts' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires superadmin privileges' })
  @Roles(Role.SUPERADMIN) // Further restrict this endpoint to superadmin only
  getUsersWithLeadCounts() {
    return this.leadsService.getUsersWithLeadCounts();
  }
}