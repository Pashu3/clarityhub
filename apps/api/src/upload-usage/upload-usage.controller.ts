import { Controller, Get, Query, Req, UseGuards, Post } from '@nestjs/common';
import { UploadUsageService } from './upload-usage.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@Controller('upload-usage')
export class UploadUsageController {
  constructor(
    private uploadUsageService: UploadUsageService
  ) {}

  @Get('stats')
  @UseGuards(OptionalJwtAuthGuard)
  async getUploadStats(@Req() req) {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.uploadUsageService.getDailyUploadStats(userId, ipAddress);
  }

  @Get('history')
  @UseGuards(OptionalJwtAuthGuard)
  async getUploadHistory(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.uploadUsageService.getUploadHistory(
      userId,
      ipAddress,
      +page,
      +limit,
    );
  }

  @Get('check-limit')
  @UseGuards(OptionalJwtAuthGuard)
  async checkUploadLimit(@Req() req) {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const subscription = req.user?.subscription;
    
    return this.uploadUsageService.checkUploadAllowed(userId, ipAddress, subscription);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async getAllUploadUsage(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.uploadUsageService.getAllUploadUsage(+page, +limit);
  }
  
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async getUsageStatistics() {
    return this.uploadUsageService.getUsageStatistics();
  }
  
  @Post('admin/cleanup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async cleanupOldGuestRecords(
    @Query('days') days = 30
  ) {
    return this.uploadUsageService.clearOldGuestRecords(+days);
  }
}