import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle, SubscriptionPlan } from '@prisma/client';

export class UpgradeSubscriptionDto {
  @ApiProperty({
    enum: BillingCycle,
    default: BillingCycle.MONTHLY,
    required: false,
  })
  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;
}

export class CancelSubscriptionDto {
  @ApiProperty({
    description: 'Whether to cancel the subscription immediately or at the end of the billing period',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  cancelImmediately?: boolean;
}

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay Order ID',
  })
  razorpayOrderId: string;

  @ApiProperty({
    description: 'Razorpay Payment ID',
  })
  razorpayPaymentId: string;

  @ApiProperty({
    description: 'Razorpay Signature',
  })
  razorpaySignature: string;
}