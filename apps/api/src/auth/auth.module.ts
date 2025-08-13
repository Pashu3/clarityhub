import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshTokenStrategy } from './refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { SecurityModule } from 'src/security/security.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
    PrismaModule,
    SecurityModule,
    PassportModule.register({ session: false }), 
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    MfaService,
  ],
  exports: [
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    MfaService,
    JwtModule
  ],
})
export class AuthModule {}
