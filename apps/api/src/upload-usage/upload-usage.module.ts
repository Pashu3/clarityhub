import { Module } from '@nestjs/common';
import { UploadUsageController } from './upload-usage.controller';
import { UploadUsageService } from './upload-usage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadUsageController],
  providers: [UploadUsageService],
  exports: [UploadUsageService],
})
export class UploadUsageModule {}