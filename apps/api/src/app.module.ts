import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { UsersModule } from './users/users.module'; 
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [PrismaModule, AuthModule, LeadsModule, UsersModule, UploadModule, AiModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}