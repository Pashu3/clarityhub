import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  BillingSettings, 
  InvoiceFormat, 
  RefundPolicy,
  SubscriptionPlan,
  UserSubscription,
  Invoice,
  Payment,
  PaymentStatus,
  InvoiceStatus
} from '@prisma/client';

@Injectable()
export class BillingAdminService {
  constructor(private prisma: PrismaService) {}

  // Billing Settings
  async getBillingSettings(): Promise<BillingSettings> {
    const settings = await this.prisma.billingSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      return this.prisma.billingSettings.create({
        data: {}  // Use schema defaults
      });
    }
    
    return settings;
  }

  async updateBillingSettings(data: any, adminId: string): Promise<BillingSettings> {
    const settings = await this.prisma.billingSettings.findFirst();
    
    if (!settings) {
      // Create settings with provided data
      return this.prisma.billingSettings.create({
        data: {
          ...data,
          updatedBy: adminId
        }
      });
    }
    
    // Update existing settings
    return this.prisma.billingSettings.update({
      where: { id: settings.id },
      data: {
        ...data,
        updatedBy: adminId,
        updatedAt: new Date()
      }
    });
  }

  // Pricing Plans
  async getAllPricingPlans() {
    return this.prisma.pricingPlan.findMany({
      orderBy: { monthlyPrice: 'asc' },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
  }

  async getPricingPlan(id: string) {
    const plan = await this.prisma.pricingPlan.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!plan) {
      throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    }
    
    return plan;
  }

  async createPricingPlan(data: any) {
    // Check if a plan with the same type already exists
    const existingPlan = await this.prisma.pricingPlan.findUnique({
      where: { planType: data.planType }
    });
    
    if (existingPlan) {
      throw new BadRequestException(`A plan with type ${data.planType} already exists`);
    }
    
    return this.prisma.pricingPlan.create({
      data: {
        ...data,
        features: Array.isArray(data.features) 
          ? JSON.stringify(data.features)
          : data.features
      }
    });
  }

  async updatePricingPlan(id: string, data: any, adminId: string) {
    // Get current plan data
    const currentPlan = await this.prisma.pricingPlan.findUnique({
      where: { id }
    });
    
    if (!currentPlan) {
      throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    }
    
    // Determine if prices have changed
    const priceChanged = 
      currentPlan.monthlyPrice !== data.monthlyPrice ||
      currentPlan.quarterlyPrice !== data.quarterlyPrice ||
      currentPlan.semiAnnualPrice !== data.semiAnnualPrice ||
      currentPlan.annualPrice !== data.annualPrice;
    
    // Create price history record if prices changed
    if (priceChanged) {
      await this.prisma.pricingPlanHistory.create({
        data: {
          planId: id,
          previousMonthlyPrice: currentPlan.monthlyPrice,
          previousQuarterlyPrice: currentPlan.quarterlyPrice,
          previousSemiAnnualPrice: currentPlan.semiAnnualPrice,
          previousAnnualPrice: currentPlan.annualPrice,
          newMonthlyPrice: data.monthlyPrice || currentPlan.monthlyPrice,
          newQuarterlyPrice: data.quarterlyPrice || currentPlan.quarterlyPrice,
          newSemiAnnualPrice: data.semiAnnualPrice || currentPlan.semiAnnualPrice,
          newAnnualPrice: data.annualPrice || currentPlan.annualPrice,
          changedBy: adminId,
          reason: data.priceChangeReason || 'Price update',
        }
      });
    }
    
    // Update the plan
    return this.prisma.pricingPlan.update({
      where: { id },
      data: {
        ...data,
        features: Array.isArray(data.features) 
          ? JSON.stringify(data.features) 
          : data.features
      }
    });
  }

  // Subscription Management
  async getAllSubscriptions(filters: any = {}, page = 1, limit = 10) {
    const where = this.buildSubscriptionFilters(filters);
    
    const [total, subscriptions] = await Promise.all([
      this.prisma.userSubscription.count({ where }),
      this.prisma.userSubscription.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true
            }
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          invoices: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);
    
    return {
      data: subscriptions,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async getSubscriptionDetails(id: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
      include: {
        user: true,
        payments: {
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          include: {
            items: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    
    return subscription;
  }

  async updateUserSubscription(id: string, data: any, adminId: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id }
    });
    
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    
    // Create audit log of the change
    await this.prisma.auditLog.create({
      data: {
        action: 'SUBSCRIPTION_UPDATED',
        description: `Admin updated subscription ${id}`,
        userId: adminId,
        ipAddress: '127.0.0.1', // In a real app, get this from the request
        resourceType: 'SUBSCRIPTION',
        resourceId: id,
        metadata: {
          before: subscription,
          after: data,
          adminId
        }
      }
    });
    
    // Update subscription
    return this.prisma.userSubscription.update({
      where: { id },
      data
    });
  }
  
  // Invoices and Payments
  async getAllInvoices(filters: any = {}, page = 1, limit = 10) {
    const where = this.buildInvoiceFilters(filters);
    
    const [total, invoices] = await Promise.all([
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          payments: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);
    
    return {
      data: invoices,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async getInvoiceDetails(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        user: true,
        subscription: true,
        items: true,
        payments: true
      }
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }

  async updateInvoice(id: string, data: any) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id }
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return this.prisma.invoice.update({
      where: { id },
      data
    });
  }
  
  async getAllPayments(filters: any = {}, page = 1, limit = 10) {
    const where = this.buildPaymentFilters(filters);
    
    const [total, payments] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          subscription: true,
          invoice: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);
    
    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async getPaymentDetails(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        subscription: true,
        invoice: {
          include: {
            items: true
          }
        }
      }
    });
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return payment;
  }
  
  // Refunds
  async processRefund(paymentId: string, amount: number, reason: string, adminId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: true,
        subscription: true
      }
    });
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    
    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Can only refund successful payments');
    }
    
    // Create refund record
    const refundPayment = await this.prisma.payment.create({
      data: {
        amount: -amount, // Negative amount for refund
        currency: payment.currency,
        status: PaymentStatus.REFUNDED,
        gateway: payment.gateway,
        gatewayPaymentId: `refund_${payment.gatewayPaymentId}`,
        description: `Refund for payment ${payment.id}: ${reason}`,
        userId: payment.userId,
        subscriptionId: payment.subscriptionId,
        invoiceId: payment.invoiceId,
        metadata: {
          originalPaymentId: payment.id,
          reason,
          refundedBy: adminId,
          refundedAt: new Date().toISOString()
        }
      }
    });
    
    // Update original payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: amount === payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
      }
    });
    
    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        action: 'PAYMENT_REFUNDED',
        description: `Admin processed refund for payment ${payment.id}`,
        userId: adminId,
        ipAddress: '127.0.0.1',
        resourceType: 'PAYMENT',
        resourceId: payment.id,
        metadata: {
          paymentId: payment.id,
          refundId: refundPayment.id,
          amount,
          reason,
          adminId
        }
      }
    });
    
    return refundPayment;
  }

  // Dashboard Analytics
  async getBillingDashboardStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    const startDate = this.getStartDateForPeriod(now, period);
    
    const [
      totalSubscriptions,
      activeSubscriptions,
      revenue,
      subscriptionsByPlan,
      revenueByDay,
      totalRefunds
    ] = await Promise.all([
      // Total subscriptions
      this.prisma.userSubscription.count(),
      
      // Active subscriptions
      this.prisma.userSubscription.count({
        where: { isActive: true }
      }),
      
      // Revenue for period
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.SUCCESS,
          createdAt: { gte: startDate },
          amount: { gt: 0 } // Only count positive amounts (not refunds)
        },
        _sum: { amount: true },
        _count: true
      }),
      
      // Subscriptions by plan
      this.prisma.userSubscription.groupBy({
        by: ['plan'],
        _count: true,
        where: { isActive: true }
      }),
      
      // Revenue by day
      this.getRevenueByTimeUnit(startDate, period),
      
      // Total refunds for period
      this.prisma.payment.aggregate({
        where: {
          OR: [
            { status: PaymentStatus.REFUNDED },
            { status: PaymentStatus.PARTIALLY_REFUNDED }
          ],
          createdAt: { gte: startDate },
          amount: { lt: 0 } // Only count negative amounts (refunds)
        },
        _sum: { amount: true },
        _count: true
      })
    ]);
    
    // Get churn rate
    const churnRate = await this.calculateChurnRate(period);
    
    // Get upcoming renewals
    const upcomingRenewals = await this.prisma.userSubscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: {
          gte: new Date(),
          lte: new Date(now.setDate(now.getDate() + 7)) // Next 7 days
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        nextBillingDate: 'asc'
      },
      take: 10
    });
    
    return {
      totalSubscriptions,
      activeSubscriptions,
      revenue: revenue._sum.amount || 0,
      paymentCount: revenue._count || 0,
      subscriptionsByPlan,
      revenueByDay,
      refunds: Math.abs(totalRefunds._sum.amount || 0),
      refundCount: totalRefunds._count || 0,
      churnRate,
      upcomingRenewals
    };
  }
  
  // Helper methods
  private buildSubscriptionFilters(filters: any) {
    const where: any = {};
    
    if (filters.plan) {
      where.plan = filters.plan;
    }
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive === 'true' || filters.isActive === true;
    }
    
    if (filters.search) {
      where.user = {
        OR: [
          { email: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
        ]
      };
    }
    
    if (filters.startDate) {
      where.createdAt = { gte: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      where.createdAt = { 
        ...where.createdAt,
        lte: new Date(filters.endDate)
      };
    }
    
    return where;
  }
  
  private buildInvoiceFilters(filters: any) {
    const where: any = {};
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.search) {
      where.OR = [
        { invoiceNumber: { contains: filters.search } },
        { user: {
          OR: [
            { email: { contains: filters.search, mode: 'insensitive' } },
            { name: { contains: filters.search, mode: 'insensitive' } },
          ]
        }}
      ];
    }
    
    if (filters.minAmount) {
      where.amount = { gte: parseFloat(filters.minAmount) };
    }
    
    if (filters.maxAmount) {
      where.amount = { 
        ...where.amount,
        lte: parseFloat(filters.maxAmount)
      };
    }
    
    if (filters.startDate) {
      where.createdAt = { gte: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      where.createdAt = { 
        ...where.createdAt,
        lte: new Date(filters.endDate)
      };
    }
    
    return where;
  }
  
  private buildPaymentFilters(filters: any) {
    const where: any = {};
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.gateway) {
      where.gateway = filters.gateway;
    }
    
    if (filters.search) {
      where.OR = [
        { gatewayPaymentId: { contains: filters.search } },
        { gatewayOrderId: { contains: filters.search } },
        { user: {
          OR: [
            { email: { contains: filters.search, mode: 'insensitive' } },
            { name: { contains: filters.search, mode: 'insensitive' } },
          ]
        }}
      ];
    }
    
    if (filters.minAmount) {
      where.amount = { gte: parseFloat(filters.minAmount) };
    }
    
    if (filters.maxAmount) {
      where.amount = { 
        ...where.amount,
        lte: parseFloat(filters.maxAmount)
      };
    }
    
    if (filters.startDate) {
      where.createdAt = { gte: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      where.createdAt = { 
        ...where.createdAt,
        lte: new Date(filters.endDate)
      };
    }
    
    return where;
  }
  
  private getStartDateForPeriod(now: Date, period: string): Date {
    const date = new Date(now);
    
    switch (period) {
      case 'day':
        date.setHours(0, 0, 0, 0);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setMonth(date.getMonth() - 1); // Default to 1 month
    }
    
    return date;
  }
  
  private async getRevenueByTimeUnit(startDate: Date, period: string) {
    let dateFormat: string;
    let interval: string;
    
    // Determine SQL date formatting based on period
    switch (period) {
      case 'day':
        dateFormat = '%Y-%m-%d %H:00';
        interval = 'hour';
        break;
      case 'week':
        dateFormat = '%Y-%m-%d';
        interval = 'day';
        break;
      case 'month':
        dateFormat = '%Y-%m-%d';
        interval = 'day';
        break;
      case 'year':
        dateFormat = '%Y-%m';
        interval = 'month';
        break;
      default:
        dateFormat = '%Y-%m-%d';
        interval = 'day';
    }
    
    // For PostgreSQL use TO_CHAR instead of DATE_FORMAT
    const query = `
      SELECT 
        TO_CHAR("createdAt", '${dateFormat}') as date,
        SUM(amount) as revenue,
        COUNT(*) as count
      FROM "Payment"
      WHERE "createdAt" >= $1
        AND status = 'SUCCESS'
        AND amount > 0
      GROUP BY date
      ORDER BY date ASC
    `;
    
    const result = await this.prisma.$queryRawUnsafe(query, startDate);
    return result;
  }
  
  private async calculateChurnRate(period: string): Promise<number> {
    const now = new Date();
    const startDate = this.getStartDateForPeriod(now, period);
    
    // Count active subscriptions at start date
    const activeAtStart = await this.prisma.userSubscription.count({
      where: {
        isActive: true,
        createdAt: { lt: startDate }
      }
    });
    
    // Count cancellations during period
    const cancelledDuringPeriod = await this.prisma.userSubscription.count({
      where: {
        cancelledAt: {
          gte: startDate,
          lte: now
        }
      }
    });
    
    // Calculate churn rate
    return activeAtStart > 0 ? (cancelledDuringPeriod / activeAtStart) * 100 : 0;
  }
}