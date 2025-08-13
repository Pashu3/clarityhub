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
    BadRequestException
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { BillingAdminService } from './billing-admin.service';
  import { Role } from '@prisma/client';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('Admin Billing')
  @ApiBearerAuth()
  @Controller('admin/billing')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  export class BillingAdminController {
    constructor(private billingAdminService: BillingAdminService) {}
  
    // Dashboard
    @Get('dashboard')
    @ApiOperation({ summary: 'Get billing dashboard statistics' })
    async getBillingDashboard(@Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month') {
      return this.billingAdminService.getBillingDashboardStats(period);
    }
  
    // Settings
    @Get('settings')
    @ApiOperation({ summary: 'Get billing settings' })
    async getBillingSettings() {
      return this.billingAdminService.getBillingSettings();
    }
  
    @Put('settings')
    @ApiOperation({ summary: 'Update billing settings' })
    async updateBillingSettings(@Body() data: any, @Req() req: any) {
      return this.billingAdminService.updateBillingSettings(data, req.user.id);
    }
  
    // Pricing Plans
    @Get('plans')
    @ApiOperation({ summary: 'Get all pricing plans' })
    async getAllPricingPlans() {
      return this.billingAdminService.getAllPricingPlans();
    }
  
    @Get('plans/:id')
    @ApiOperation({ summary: 'Get pricing plan by ID' })
    async getPricingPlan(@Param('id') id: string) {
      return this.billingAdminService.getPricingPlan(id);
    }
  
    @Post('plans')
    @ApiOperation({ summary: 'Create new pricing plan' })
    async createPricingPlan(@Body() data: any) {
      return this.billingAdminService.createPricingPlan(data);
    }
  
    @Put('plans/:id')
    @ApiOperation({ summary: 'Update pricing plan' })
    async updatePricingPlan(
      @Param('id') id: string,
      @Body() data: any,
      @Req() req: any
    ) {
      return this.billingAdminService.updatePricingPlan(id, data, req.user.id);
    }
  
    // Subscriptions
    @Get('subscriptions')
    @ApiOperation({ summary: 'Get all subscriptions with filtering' })
    async getAllSubscriptions(
      @Query() filters: any,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.billingAdminService.getAllSubscriptions(filters, +page, +limit);
    }
  
    @Get('subscriptions/:id')
    @ApiOperation({ summary: 'Get subscription details' })
    async getSubscriptionDetails(@Param('id') id: string) {
      return this.billingAdminService.getSubscriptionDetails(id);
    }
  
    @Put('subscriptions/:id')
    @ApiOperation({ summary: 'Update user subscription' })
    async updateUserSubscription(
      @Param('id') id: string,
      @Body() data: any,
      @Req() req: any
    ) {
      return this.billingAdminService.updateUserSubscription(id, data, req.user.id);
    }
  
    // Invoices
    @Get('invoices')
    @ApiOperation({ summary: 'Get all invoices with filtering' })
    async getAllInvoices(
      @Query() filters: any,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.billingAdminService.getAllInvoices(filters, +page, +limit);
    }
  
    @Get('invoices/:id')
    @ApiOperation({ summary: 'Get invoice details' })
    async getInvoiceDetails(@Param('id') id: string) {
      return this.billingAdminService.getInvoiceDetails(id);
    }
  
    @Put('invoices/:id')
    @ApiOperation({ summary: 'Update invoice' })
    async updateInvoice(
      @Param('id') id: string,
      @Body() data: any
    ) {
      return this.billingAdminService.updateInvoice(id, data);
    }
  
    // Payments
    @Get('payments')
    @ApiOperation({ summary: 'Get all payments with filtering' })
    async getAllPayments(
      @Query() filters: any,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.billingAdminService.getAllPayments(filters, +page, +limit);
    }
  
    @Get('payments/:id')
    @ApiOperation({ summary: 'Get payment details' })
    async getPaymentDetails(@Param('id') id: string) {
      return this.billingAdminService.getPaymentDetails(id);
    }
  
    // Refunds
    @Post('refunds')
    @ApiOperation({ summary: 'Process a refund' })
    async processRefund(
      @Body() data: { 
        paymentId: string; 
        amount: number; 
        reason: string 
      },
      @Req() req: any
    ) {
      if (!data.paymentId || !data.amount || !data.reason) {
        throw new BadRequestException('Payment ID, amount, and reason are required');
      }
      
      return this.billingAdminService.processRefund(
        data.paymentId, 
        data.amount, 
        data.reason, 
        req.user.id
      );
    }
  }