import { Module } from '@nestjs/common';
import { BillingAdminController } from './billing-admin.controller';
import { BillingAdminService } from './billing-admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BillingAdminController],
  providers: [BillingAdminService],
  exports: [BillingAdminService],
})
export class BillingAdminModule {}