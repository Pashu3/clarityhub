import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { UsersModule } from './users/users.module'; 
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UploadUsageModule } from './upload-usage/upload-usage.module';
import { SharedChatsModule } from './shared-chats/shared-chats.module';
import { DataManagementModule } from './data-management/data-management.module'; 
import { AnalyticsModule } from './analytics/analytics.module';
import { SecurityModule } from './security/security.module';
import { AuthLoggingMiddleware } from './auth/auth-logging.middleware';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ContentModule } from './content/content.module';
import { SupportModule } from './support/support.module';
import { PaymentsModule } from './payments/payments.module';
import { BillingAdminService } from './billing-admin/billing-admin.service';
import { BillingAdminController } from './billing-admin/billing-admin.controller';
import { BillingAdminModule } from './billing-admin/billing-admin.module';

@Module({
  imports: [PrismaModule, AuthModule, LeadsModule, UsersModule, UploadModule, AiModule, SubscriptionModule, UploadUsageModule, SharedChatsModule, DataManagementModule, AnalyticsModule, SecurityModule, ContentModule, SupportModule, PaymentsModule, BillingAdminModule], 
  controllers: [AppController, BillingAdminController],
  providers: [AppService, BillingAdminService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthLoggingMiddleware)
      .forRoutes('auth');
  }
}