import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuditService } from './audit.service';
import { GeolocationService } from './geolocation.service';
import { DeviceDetectionService } from './device-detection.service';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { AuthLoggingMiddleware } from '../auth/auth-logging.middleware';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [SecurityController],  
  providers: [
    AuditService,
    GeolocationService,
    DeviceDetectionService,
    SecurityService
  ],
  exports: [
    AuditService,
    GeolocationService, 
    DeviceDetectionService,
    SecurityService,
    JwtModule  
  ]
})
export class SecurityModule {}