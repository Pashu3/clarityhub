import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import Razorpay = require('razorpay');
import { PrismaService } from '../prisma/prisma.service';
import { BillingCycle, PaymentGateway, PaymentStatus, PaymentMode, SubscriptionPlan } from '@prisma/client';
@Injectable()
export class RazorpayService {
  private razorpay: any;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize Razorpay client with null check
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    
    if (!keyId || !keySecret) {
      console.error('Razorpay credentials missing. Check your environment variables.');
    } else {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }

  /**
   * Create a Razorpay order for a subscription payment
   */
  async createSubscriptionOrder(userId: string, plan: SubscriptionPlan, billingCycle: BillingCycle) {
    try {
      // Get the pricing plan
      const pricingPlan = await this.prisma.pricingPlan.findUnique({
        where: { planType: plan },
      });

      if (!pricingPlan) {
        throw new BadRequestException(`Pricing plan ${plan} not found`);
      }

      if (!pricingPlan.isActive) {
        throw new BadRequestException('This pricing plan is no longer available');
      }

      // Get user details
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Determine price based on billing cycle
      let price: number;
      let duration: string;
      
      switch (billingCycle) {
        case BillingCycle.MONTHLY:
          price = pricingPlan.monthlyPrice;
          duration = 'monthly';
          break;
        case BillingCycle.QUARTERLY:
          price = pricingPlan.quarterlyPrice || pricingPlan.monthlyPrice * 3;
          duration = 'quarterly';
          break;
        case BillingCycle.SEMI_ANNUAL:
          price = pricingPlan.semiAnnualPrice || pricingPlan.monthlyPrice * 6;
          duration = '6 months';
          break;
        case BillingCycle.ANNUAL:
          price = pricingPlan.annualPrice || pricingPlan.monthlyPrice * 12;
          duration = 'annual';
          break;
        default:
          price = pricingPlan.monthlyPrice;
          duration = 'monthly';
      }

      // Create or update user subscription
      const subscription = await this.updateUserSubscription(userId, plan, billingCycle, price);
      
      // Create invoice
      const invoice = await this.createInvoice(userId, subscription.id, pricingPlan.name, price);
      
      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          amount: price,
          currency: pricingPlan.currency || 'INR',
          status: PaymentStatus.PENDING,
          gateway: PaymentGateway.RAZORPAY,
          description: `${pricingPlan.name} ${duration} subscription`,
          userId,
          subscriptionId: subscription.id,
          invoiceId: invoice.id,
        },
      });

      // Create Razorpay order (amount in paise)
      const orderOptions = {
        amount: price * 100, // Razorpay takes amount in paise
        currency: pricingPlan.currency || 'INR',
        receipt: `receipt_${payment.id}`,
        notes: {
          paymentId: payment.id,
          userId: userId,
          plan: plan,
          billingCycle: billingCycle,
        },
      };

      const order = await this.razorpay.orders.create(orderOptions);

      // Update payment with order ID
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          gatewayOrderId: order.id,
        },
      });

      return {
        key: this.configService.get<string>('RAZORPAY_KEY_ID'),
        orderId: order.id,
        amount: price * 100,
        currency: pricingPlan.currency || 'INR',
        name: 'ClarityHub',
        description: `${pricingPlan.name} ${duration} subscription`,
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          paymentId: payment.id,
          plan: plan,
          duration: duration,
        },
      };
    } catch (error) {
      console.error('Error creating subscription order:', error);
      throw new InternalServerErrorException('Failed to create subscription order');
    }
  }

  /**
   * Verify and process payment after Razorpay callback
   */
  async verifyPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;

      // Find payment by order ID
      const payment = await this.prisma.payment.findFirst({
        where: { gatewayOrderId: razorpayOrderId },
        include: {
          subscription: true,
          invoice: true,
        },
      });

      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      // Verify signature
      const isValid = this.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      );

      if (!isValid) {
        // Update payment status to failed
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.FAILED,
            gatewayPaymentId: razorpayPaymentId,
            gatewaySignature: razorpaySignature,
          },
        });
        throw new BadRequestException('Invalid payment signature');
      }

      // Get payment details from Razorpay
      const razorpayPayment = await this.razorpay.payments.fetch(razorpayPaymentId);

      // Update payment record
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: razorpayPayment.status === 'captured' ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
          gatewayPaymentId: razorpayPaymentId,
          gatewaySignature: razorpaySignature,
          metadata: razorpayPayment,
          paymentMode: this.mapRazorpayMethodToPaymentMode(razorpayPayment.method),
        },
      });

      // If payment successful, update subscription and invoice
      if (updatedPayment.status === PaymentStatus.SUCCESS) {
        // Update invoice
        await this.prisma.invoice.update({
          where: { id: payment.invoiceId ?? undefined },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        });

        // Update subscription dates based on billing cycle
        if (payment.subscription) {
          const nextBillingDate = this.calculateNextBillingDate(
            payment.subscription.billingCycle,
          );

          await this.prisma.userSubscription.update({
            where: { id: payment.subscriptionId ?? undefined },
            data: {
              isActive: true,
              nextBillingDate,
              endDate: nextBillingDate,
            },
          });
        }
      }

      return {
        success: updatedPayment.status === PaymentStatus.SUCCESS,
        paymentId: updatedPayment.id,
        status: updatedPayment.status,
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new InternalServerErrorException('Failed to verify payment');
    }
  }

  /**
   * Process webhook events from Razorpay
   */
  async processWebhook(payload: any, signature: string) {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(
        JSON.stringify(payload),
        signature,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid webhook signature');
      }

      // Log webhook event
      const webhookEvent = await this.prisma.webhookEvent.create({
        data: {
          gateway: PaymentGateway.RAZORPAY,
          eventType: payload.event,
          payload,
          status: 'RECEIVED',
        },
      });

      // Process different event types
      switch (payload.event) {
        case 'payment.authorized':
          await this.handlePaymentAuthorized(payload.payload.payment.entity);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payload.payload.payment.entity);
          break;
        // Add more event handlers as needed
      }

      // Mark webhook as processed
      await this.prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new InternalServerErrorException('Failed to process webhook');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, cancelImmediately: boolean = false) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new BadRequestException('No active subscription found');
    }

    // Cancel subscription in Razorpay if we have a subscription ID
    if (subscription.gatewaySubscriptionId) {
      try {
        await this.razorpay.subscriptions.cancel(subscription.gatewaySubscriptionId);
      } catch (error) {
        // Continue even if Razorpay cancellation fails
        console.error('Error cancelling subscription in Razorpay:', error);
      }
    }

    // Update subscription in our database
    const updateData: any = {
      cancelledAt: new Date(),
      autoRenew: false,
    };

    // If immediate cancellation requested, end subscription now
    if (cancelImmediately) {
      updateData.isActive = false;
      updateData.endDate = new Date();
    }

    return this.prisma.userSubscription.update({
      where: { id: subscription.id },
      data: updateData,
    });
  }

  /**
   * Helper Methods
   */

  private async updateUserSubscription(
    userId: string,
    plan: SubscriptionPlan,
    billingCycle: BillingCycle,
    price: number,
  ) {
    const now = new Date();
    const nextBillingDate = this.calculateNextBillingDate(billingCycle);

    return this.prisma.userSubscription.upsert({
      where: { userId },
      update: {
        plan,
        billingCycle,
        price,
        isActive: true, // Will be fully activated after payment
        nextBillingDate,
        startDate: now,
        endDate: nextBillingDate,
        cancelledAt: null,
        updatedAt: now,
        autoRenew: true,
      },
      create: {
        userId,
        plan,
        billingCycle,
        price,
        isActive: true, // Will be fully activated after payment
        nextBillingDate,
        startDate: now,
        endDate: nextBillingDate,
        autoRenew: true,
      },
    });
  }

  private calculateNextBillingDate(billingCycle: BillingCycle): Date {
    const date = new Date();

    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case BillingCycle.QUARTERLY:
        date.setMonth(date.getMonth() + 3);
        break;
      case BillingCycle.SEMI_ANNUAL:
        date.setMonth(date.getMonth() + 6);
        break;
      case BillingCycle.ANNUAL:
        date.setFullYear(date.getFullYear() + 1);
        break;
    }

    return date;
  }

  private async createInvoice(userId: string, subscriptionId: string, planName: string, amount: number) {
    // Generate invoice number
    const latestInvoice = await this.prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let invoiceNumber = 'INV-0001';
    if (latestInvoice) {
      const lastNum = parseInt(latestInvoice.invoiceNumber.split('-')[1]);
      invoiceNumber = `INV-${(lastNum + 1).toString().padStart(4, '0')}`;
    }

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        amount,
        totalAmount: amount, // No tax/discount in this example
        currency: 'INR',
        status: 'PENDING',
        dueDate: new Date(), // Due immediately
        userId,
        subscriptionId,
        items: {
          create: [
            {
              description: `${planName} Subscription`,
              quantity: 1,
              unitPrice: amount,
              amount,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });
  }

  private async handlePaymentAuthorized(paymentEntity: any) {
    // Find payment by Razorpay payment ID
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayPaymentId: paymentEntity.id },
      include: {
        subscription: true,
        invoice: true,
      },
    });
  
    if (!payment) {
      console.log('Payment not found for ID:', paymentEntity.id);
      return;
    }
  
    // Update payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCESS,
        metadata: paymentEntity,
      },
    });
  
    // Update invoice - Fix null check
    if (payment.invoiceId) {
      await this.prisma.invoice.update({
        where: { id: payment.invoiceId }, // This can't be null here since we're checking above
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    }
  
    // Update subscription - Fix null check
    if (payment.subscriptionId) {
      await this.prisma.userSubscription.update({
        where: { id: payment.subscriptionId }, // This can't be null here since we're checking above
        data: {
          isActive: true,
        },
      });
    }
  }

  private async handlePaymentFailed(paymentEntity: any) {
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayPaymentId: paymentEntity.id },
    });

    if (!payment) {
      console.log('Payment not found for ID:', paymentEntity.id);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        metadata: paymentEntity,
      },
    });
  }

  private verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is missing');
      return false;
    }
    
    const text = orderId + '|' + paymentId;
    const expectedSignature = createHmac('sha256', secret)
      .update(text)
      .digest('hex');
    
    return expectedSignature === signature;
  }
  
  private verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is missing');
      return false;
    }
    
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return expectedSignature === signature;
  }

  private mapRazorpayMethodToPaymentMode(method: string): PaymentMode | null {
    const methodMap: Record<string, PaymentMode> = {
      'card': PaymentMode.CREDIT_CARD,
      'netbanking': PaymentMode.NET_BANKING,
      'wallet': PaymentMode.WALLET,
      'upi': PaymentMode.UPI,
      'emi': PaymentMode.EMI,
    };
    
    return methodMap[method] || null;
  }
}