import { Controller, Get, Post, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillingCycle, SubscriptionPlan } from '@prisma/client';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({ status: 200, description: 'Returns user subscription details' })
  async getSubscription(@Req() req: any) {
    const stats = await this.subscriptionService.getUserUploadStats(req.user.userId);
    return {
      ...stats,
      user: {
        id: req.user.userId,
        email: req.user.email,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade to premium subscription' })
  @ApiResponse({ status: 200, description: 'Returns payment order details for Razorpay checkout' })
  async upgradeToPremium(
    @Req() req: any,
    @Body() body: { billingCycle?: BillingCycle },
  ) {
    const billingCycle = body.billingCycle || BillingCycle.MONTHLY;
    
    return this.subscriptionService.createOrUpdateSubscription(
      req.user.userId,
      'PREMIUM',
      billingCycle
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('downgrade')
  @ApiOperation({ summary: 'Downgrade to free plan' })
  @ApiResponse({ status: 200, description: 'Returns updated subscription' })
  async downgradeToFree(@Req() req: any) {
    const subscription = await this.subscriptionService.createOrUpdateSubscription(
      req.user.userId,
      'FREE'
    );
    
    return {
      message: 'Subscription downgraded to free plan',
      subscription,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({ status: 200, description: 'Returns cancellation details' })
  async cancelSubscription(
    @Req() req: any, 
    @Body() body: { cancelImmediately?: boolean },
  ) {
    await this.subscriptionService.cancelSubscription(
      req.user.userId, 
      body.cancelImmediately || false
    );
    
    return {
      message: 'Subscription cancelled successfully',
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('verify-payment')
  @ApiOperation({ summary: 'Verify payment after Razorpay checkout' })
  @ApiResponse({ status: 200, description: 'Returns verification result' })
  async verifyPayment(
    @Body()
    paymentData: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ) {
    return this.subscriptionService.verifyPayment(paymentData);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available pricing plans' })
  @ApiResponse({ status: 200, description: 'Returns list of pricing plans' })
  async getPricingPlans() {
    return this.subscriptionService.getPricingPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoices')
  @ApiOperation({ summary: 'Get user invoices' })
  @ApiResponse({ status: 200, description: 'Returns list of user invoices' })
  async getUserInvoices(@Req() req: any) {
    return this.subscriptionService.getUserInvoices(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments')
  @ApiOperation({ summary: 'Get user payment history' })
  @ApiResponse({ status: 200, description: 'Returns list of user payments' })
  async getUserPayments(@Req() req: any) {
    return this.subscriptionService.getUserPayments(req.user.userId);
  }
}