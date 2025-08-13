import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayService } from '../payments/razorpay.service';
import { BillingCycle, SubscriptionPlan } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private razorpayService: RazorpayService,
  ) {}


  async getUserSubscription(userId: string) {
    return this.prisma.userSubscription.findUnique({
      where: { userId },
    });
  }

  async createOrUpdateSubscription(userId: string, planType: SubscriptionPlan, billingCycle: BillingCycle = BillingCycle.MONTHLY) {
    // For free plan, directly update the subscription without payment
    if (planType === 'FREE') {
      return this.prisma.userSubscription.upsert({
        where: { userId },
        update: {
          plan: planType,
          isActive: true,
          price: 0,
          billingCycle: BillingCycle.MONTHLY,
          updatedAt: new Date(),
          autoRenew: false,
          nextBillingDate: null,
          cancelledAt: null,
        },
        create: {
          userId,
          plan: planType,
          isActive: true,
          price: 0,
          billingCycle: BillingCycle.MONTHLY,
          autoRenew: false,
        },
      });
    }
    
    // For paid plans, redirect to Razorpay
    return this.razorpayService.createSubscriptionOrder(userId, planType, billingCycle);
  }

  async cancelSubscription(userId: string, cancelImmediately: boolean = false) {
    // Check user's plan first
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });
    
    // For free plans, just update the record
    if (subscription?.plan === 'FREE') {
      return this.prisma.userSubscription.update({
        where: { userId },
        data: {
          isActive: false,
          cancelledAt: new Date(),
          endDate: cancelImmediately ? new Date() : subscription.endDate,
        },
      });
    }
    
    // For paid plans, handle via Razorpay service
    return this.razorpayService.cancelSubscription(userId, cancelImmediately);
  }
  async verifyPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return this.razorpayService.verifyPayment(paymentData);
  }
  async getPricingPlans() {
    return this.prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' },
    });
  }
  async checkUploadAllowed(userId?: string, ipAddress?: string) {
    // If user is logged in, check their subscription first
    if (userId) {
      const subscription = await this.prisma.userSubscription.findUnique({
        where: { userId },
      });

      // Premium users can upload unlimited files
      if (subscription?.plan === 'PREMIUM' && subscription?.isActive) {
        return {
          allowed: true,
          reason: 'PREMIUM_SUBSCRIPTION',
        };
      }

      // Check daily uploads for logged-in free users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dailyUploads = await this.prisma.uploadUsage.count({
        where: {
          userId,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (dailyUploads < 1) {
        return {
          allowed: true,
          reason: 'DAILY_FREE_UPLOAD',
          remaining: 1 - dailyUploads,
        };
      }

      return {
        allowed: false,
        reason: 'DAILY_LIMIT_REACHED',
        message: 'You have reached your daily upload limit. Upgrade to Premium for unlimited uploads.',
      };
    }

    // Guest user logic
    if (ipAddress) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const guestDailyUploads = await this.prisma.uploadUsage.count({
        where: {
          ipAddress,
          userId: null,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (guestDailyUploads < 1) {
        return {
          allowed: true,
          reason: 'GUEST_DAILY_FREE_UPLOAD',
          remaining: 1 - guestDailyUploads,
        };
      }

      return {
        allowed: false,
        reason: 'GUEST_DAILY_LIMIT_REACHED',
        message: 'You have reached your daily guest upload limit. Sign up or log in for an additional daily upload.',
      };
    }

    return {
      allowed: false,
      reason: 'UNKNOWN_USER',
      message: 'Unable to identify user for upload permission.',
    };
  }

  async logUploadUsage(fileId: string, userId?: string, ipAddress?: string) {
    return this.prisma.uploadUsage.create({
      data: {
        fileId,
        userId,
        ipAddress: ipAddress || 'unknown',
      },
    });
  }

  // For analytics and dashboard
  async getUserUploadStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalUploads, todayUploads, subscription] = await Promise.all([
      this.prisma.uploadUsage.count({ where: { userId } }),
      this.prisma.uploadUsage.count({
        where: {
          userId,
          uploadDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      this.getUserSubscription(userId),
    ]);

    return {
      totalUploads,
      todayUploads,
      remainingToday: subscription?.plan === 'PREMIUM' ? 'unlimited' : Math.max(0, 1 - todayUploads),
      subscription: {
        plan: subscription?.plan || 'FREE',
        isActive: subscription?.isActive || false,
        billingCycle: subscription?.billingCycle || null,
        nextBillingDate: subscription?.nextBillingDate || null,
      },
    };
  }
  async getUserInvoices(userId: string) {
    return this.prisma.invoice.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get user payment history
  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}