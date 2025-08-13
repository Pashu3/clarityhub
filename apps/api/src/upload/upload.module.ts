import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { UploadUsageModule } from '../upload-usage/upload-usage.module'; // Import the module

@Module({
  imports: [
    PrismaModule,
    AiModule,
    UploadUsageModule, 
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}