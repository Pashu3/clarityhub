import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { MfaService } from './mfa.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MfaLoginDto } from './dto/mfa-login.dto';
import { Provider } from '@prisma/client';
import { AuditService } from '../security/audit.service';
import { GeolocationService } from '../security/geolocation.service';
import { DeviceDetectionService } from '../security/device-detection.service';
import { Request } from 'express';

interface MfaStatus {
  mfaEnabled: boolean;
  mfaVerified: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mfaService: MfaService,
    private auditService: AuditService,
    private geoService: GeolocationService,
    private deviceService: DeviceDetectionService
  ) { }

  async register(dto: RegisterDto, req?: Request) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ForbiddenException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);
    const now = new Date();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        provider: Provider.CREDENTIALS,
        lastLoginAt: now,
        lastSeenAt: now,
      },
    });

    // Log registration
    if (req) {
      const ipAddress = req.ip || 'unknown';
      const userAgent = req.headers['user-agent'] || '';
      const locationData = await this.geoService.getLocationFromIp(ipAddress);
      const location = this.geoService.formatLocation(locationData);
      const device = this.deviceService.formatUserAgent(userAgent);
      
      await this.auditService.logActivity({
        action: 'User registered',
        description: `New user registered: ${dto.email}`,
        userId: user.id,
        ipAddress: ipAddress || undefined,
        resourceType: 'users',
        resourceId: user.id,
        metadata: null // Explicitly set to null
      });
    }

    return this.signTokens(user.id, user.email);
  }

  async login(dto: LoginDto | MfaLoginDto, req?: Request) {
    const ipAddress = req?.ip || 'unknown';
    const userAgent = req?.headers['user-agent'] || '';
    const locationData = req ? await this.geoService.getLocationFromIp(ipAddress) : null;
    const location = locationData ? this.geoService.formatLocation(locationData) : 'Unknown';
    const device = this.deviceService.formatUserAgent(userAgent);
    
    // Use findUnique with minimal fields and then add MFA handling conditionally
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password: true,
        isActive: true,
        role: true,
      }
    });

    if (!user) {
      await this.auditService.logLoginAttempt({
        email: dto.email,
        ipAddress,
        userAgent,
        status: 'Failed',
        reason: 'Invalid credentials',
        location,
        device,
      });
      
      // Check if we should create a security alert for multiple failed attempts
      const recentFailedAttempts = await this.prisma.loginAttempt.count({
        where: {
          email: dto.email,
          status: 'Failed',
          createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }, // Last 30 minutes
        },
      });
      
      // If 3 or more failed attempts in 30 minutes, create an alert
      if (recentFailedAttempts >= 3) {
        await this.auditService.createSecurityAlert({
          severity: 'High',
          type: 'Login attempt',
          status: 'Active',
          message: `Multiple failed login attempts for ${dto.email}`,
          details: `${recentFailedAttempts} failed attempts in the last 30 minutes`,
          ipAddress,
          location,
        });
      }
      
      throw new ForbiddenException('Invalid credentials');
    }

    if (!user.isActive) {
      await this.auditService.logLoginAttempt({
        userId: user.id,
        email: dto.email,
        ipAddress,
        userAgent,
        status: 'Failed',
        reason: 'Account inactive',
        location,
        device,
      });
      
      throw new ForbiddenException('Account is inactive');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      await this.auditService.logLoginAttempt({
        userId: user.id,
        email: dto.email,
        ipAddress,
        userAgent,
        status: 'Failed',
        reason: 'Invalid password',
        location,
        device,
      });
      
      throw new ForbiddenException('Invalid credentials');
    }

    // Rest of your existing login logic...
    let requiresMfa = false;

    try {
      const mfaStatus = await this.prisma.$queryRaw<MfaStatus[]>`
        SELECT "mfaEnabled", "mfaVerified" FROM "User" WHERE id = ${user.id}
      `;

      requiresMfa = mfaStatus[0]?.mfaEnabled ||
        ['ADMIN', 'SUPERADMIN'].includes(user.role);
    } catch (error) {
      requiresMfa = ['ADMIN', 'SUPERADMIN'].includes(user.role);
    }

    if (requiresMfa && !('mfaToken' in dto)) {
      return {
        message: 'MFA required',
        requiresMfa: true,
        userId: user.id,
      };
    }

    if (requiresMfa && 'mfaToken' in dto && dto.mfaToken) {
      try {
        const isValidToken = await this.mfaService.validateMfaForUser(user.id, dto.mfaToken);
        if (!isValidToken) {
          throw new UnauthorizedException('Invalid MFA token');
        }
      } catch (error) {
        console.error('MFA validation error:', error);
        console.warn('Proceeding without MFA verification due to schema transition');
      }
    }

    const now = new Date();
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: now,
        lastSeenAt: now
      },
    });

    // Log successful login
    await this.auditService.logLoginAttempt({
      userId: user.id,
      email: dto.email,
      ipAddress,
      userAgent,
      status: 'Success',
      location,
      device,
    });
    
    // Generate tokens
    const tokens = await this.signTokens(
      user.id,
      user.email,
      requiresMfa ? { mfaVerified: true } : undefined
    );
    
    // Create a user session
    if (req) {
      const sessionExpiry = new Date();
      sessionExpiry.setHours(sessionExpiry.getHours() + 24); // 24-hour session
      
      // Handle x-client-type header which might be an array
      let clientType = 'Web';
      const headerType = req.headers['x-client-type'];
      if (headerType) {
        clientType = Array.isArray(headerType) ? headerType[0] : headerType;
      }
      
      await this.prisma.userSession.create({
        data: {
          userId: user.id,
          token: tokens.accessToken, // Store the JWT
          ipAddress,
          userAgent,
          device,
          location,
          type: clientType,
          expiresAt: sessionExpiry,
          lastActivityAt: now,
        },
      });
    }
    
    return tokens;
  }

  async signTokens(userId: string, email: string, additionalPayload?: Record<string, any>) {
    const payload = {
      sub: userId,
      email,
      ...additionalPayload
    };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRT },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        refreshToken: true,
        isActive: true,
        role: true,
      }
    });

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    if (!user.isActive) throw new ForbiddenException('Account is inactive');

    const isMatch = await bcrypt.compare(rt, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    await this.prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() },
    });

    let mfaEnabled = false;
    let mfaVerified = false;

    try {
      const mfaStatus = await this.prisma.$queryRaw<MfaStatus[]>`
        SELECT "mfaEnabled", "mfaVerified" FROM "User" WHERE id = ${user.id}
      `;
      mfaEnabled = mfaStatus[0]?.mfaEnabled || false;
      mfaVerified = mfaStatus[0]?.mfaVerified || false;
    } catch (error) {
      // Silent catch - use default values
    }

    const requiresMfa = mfaEnabled || ['ADMIN', 'SUPERADMIN'].includes(user.role);
    const additionalPayload = requiresMfa ? { mfaVerified } : undefined;

    const tokens = await this.signTokens(user.id, user.email, additionalPayload);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshTokenHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async logout(userId: string, token?: string) {
    if (token) {
      // Find and delete the specific session
      await this.prisma.userSession.deleteMany({
        where: {
          userId,
          token,
        },
      });
    } else {
      // If no token provided, delete all user sessions (more aggressive logout)
      await this.prisma.userSession.deleteMany({
        where: { userId },
      });
    }
    
    // Also clear the refresh token
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async validateOrCreateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    const now = new Date();

    if (!user) {
      const hashedPassword = await bcrypt.hash('random_string', 10);

      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          picture: googleUser.picture,
          provider: Provider.GOOGLE,
          password: hashedPassword,
          lastLoginAt: now,
          lastSeenAt: now,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: now,
          lastSeenAt: now
        },
      });
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async getMe(userId: string) {
    await this.updateLastSeen(userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        picture: true,
        role: true,
        createdAt: true,
        isActive: true,
        lastLoginAt: true,
        lastSeenAt: true,
      },
    });

    // Add MFA status if available
    try {
      const mfaStatus = await this.prisma.$queryRaw<MfaStatus[]>`
        SELECT "mfaEnabled", "mfaVerified" FROM "User" WHERE id = ${userId}
      `;

      return {
        ...user,
        mfaEnabled: mfaStatus[0]?.mfaEnabled || false,
        mfaVerified: mfaStatus[0]?.mfaVerified || false
      };
    } catch (error) {
      return user;
    }
  }

  async updateProfile(userId: string, data: { name?: string; picture?: string }) {
    await this.updateLastSeen(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        lastSeenAt: new Date(),
      },
    });
  }

  async updateLastSeen(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastSeenAt: new Date() },
      });
    } catch (error) {
      console.error('Error updating last seen timestamp:', error);
    }
  }
// Add these methods to the AuthService class
async verifyAuthStatus(accessToken: string, refreshToken?: string) {
  try {
    // First try to verify the access token
    try {
      const decoded = this.jwt.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      
      // If valid, get user data but exclude sensitive fields
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          picture: true,
          role: true,
          isActive: true,
        },
      });
      
      if (!user || !user.isActive) {
        return { isAuthenticated: false };
      }
      
      // Update last seen
      await this.updateLastSeen(user.id);
      
      return {
        isAuthenticated: true,
        user,
      };
    } catch (tokenError) {
      // Access token is invalid, try refresh token if available
      if (refreshToken) {
        try {
          // Verify the refresh token
          const decoded = this.jwt.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
          });
          
          const userId = decoded.sub;
          
          // Find the user and compare refresh tokens
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
              picture: true,
              role: true,
              isActive: true,
              refreshToken: true,
            },
          });
          
          if (!user || !user.isActive || !user.refreshToken) {
            return { isAuthenticated: false };
          }
          
          // Validate stored refresh token (hashed)
          const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
          
          if (!rtMatches) {
            return { isAuthenticated: false };
          }
          
          // Generate new access token
          const newTokens = await this.signTokens(user.id, user.email);
          
          // Update last seen
          await this.updateLastSeen(user.id);
          
          // Return user data and the new access token to be set in cookie
          return {
            isAuthenticated: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              firstName: user.firstName,
              lastName: user.lastName,
              picture: user.picture,
              role: user.role,
            },
            newAccessToken: newTokens.accessToken,
          };
        } catch (refreshError) {
          return { isAuthenticated: false };
        }
      }
      
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return { isAuthenticated: false };
  }
}
  async getUserActivityStatus(userId: string): Promise<'online' | 'away' | 'offline'> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastSeenAt: true, isActive: true },
    });

    if (!user || !user.isActive || !user.lastSeenAt) {
      return 'offline';
    }

    const now = new Date();
    const lastSeenMs = user.lastSeenAt.getTime();
    const diffMinutes = (now.getTime() - lastSeenMs) / (1000 * 60);

    if (diffMinutes < 5) {
      return 'online';
    } else if (diffMinutes < 30) {
      return 'away';
    }

    return 'offline';
  }

  async verifyMfaToken(userId: string, token: string): Promise<boolean> {
    return this.mfaService.verifyMfaToken(userId, token);
  }
}