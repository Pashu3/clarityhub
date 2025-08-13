import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportChatGateway } from './support-chat.gateway';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SupportController],
  providers: [SupportService, SupportChatGateway],
  exports: [SupportService]
})
export class SupportModule {}