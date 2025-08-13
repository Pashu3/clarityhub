import { Module } from '@nestjs/common';
import { SharedChatsService } from './shared-chats.service';
import { SharedChatsController } from './shared-chats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SharedChatsController],
  providers: [SharedChatsService],
  exports: [SharedChatsService],
})
export class SharedChatsModule {}