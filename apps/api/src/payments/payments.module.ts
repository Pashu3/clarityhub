import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [RazorpayService],
  exports: [RazorpayService],
})
export class PaymentsModule {}