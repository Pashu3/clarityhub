import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { MfaService } from './mfa.service';
import { Role } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private prisma: PrismaService,
    private mfaService: MfaService
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      passReqToCallback: true,
      ignoreExpiration: false,
    };

    super(options);
  }

  async validate(req: Request, payload: any) {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    
    // Check if user exists in database
    if (payload.sub) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          include: { subscription: true },
        });
        
        if (user) {
          this.logger.debug(`Found user: ${user.id}`);
          
          // Check if MFA is required for this user (admin role)
          if (user.role === Role.ADMIN || user.role === Role.SUPERADMIN) {
            // For admin users, ensure MFA is set up and verified
            if (!user.mfaEnabled || !user.mfaVerified) {
              this.logger.warn(`Admin user ${user.id} does not have MFA configured`);
              throw new UnauthorizedException('MFA setup required for admin access');
            }
            
            // Check if token includes MFA verification
            if (!payload.mfaVerified) {
              // Depending on your implementation, you might redirect to MFA challenge
              // or throw an exception
              this.logger.warn(`Admin user ${user.id} accessing without MFA verification`);
              throw new UnauthorizedException('MFA verification required');
            }
            
            this.logger.debug(`Admin user ${user.id} authenticated with MFA`);
          }
          
          // Return user data and subscription info
          return {
            sub: payload.sub,
            email: payload.email,
            role: user.role,
            mfaVerified: !!payload.mfaVerified,
            subscription: user.subscription ? {
              plan: user.subscription.plan,
              isActive: user.subscription.isActive
            } : null
          };
        } else {
          this.logger.warn(`User with ID ${payload.sub} not found in database`);
        }
      } catch (error) {
        this.logger.error(`Error validating token: ${error.message}`);
        throw error; // Re-throw to ensure unauthorized access is blocked
      }
    }
    
    // Return the basic payload if user not found or error occurred
    return payload;
  }
}