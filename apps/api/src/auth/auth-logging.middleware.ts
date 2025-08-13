import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../security/audit.service';
import { GeolocationService } from '../security/geolocation.service';
import { DeviceDetectionService } from '../security/device-detection.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { MfaLoginDto } from './dto/mfa-login.dto';

@Injectable()
export class AuthLoggingMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private jwtService: JwtService,
    private geoService: GeolocationService,
    private deviceService: DeviceDetectionService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/auth/')) {
      const originalEnd = res.end;
      const originalWrite = res.write;
      const originalJson = res.json;
      const chunks: Buffer[] = [];
      const self = this;
      
      res.json = function(body) {
        res.locals.responseBody = body;
        return originalJson.call(this, body);
      };
      
      // Override write to capture chunks
      res.write = function(chunk) {
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk);
        } else if (typeof chunk === 'string') {
          chunks.push(Buffer.from(chunk));
        }
        return originalWrite.apply(res, arguments as any);
      };
      
      // Override end function to process after response
      res.end = function(...args: any[]): any {
        // Capture final chunk if any
        if (args[0]) {
          const chunk = args[0];
          if (Buffer.isBuffer(chunk)) {
            chunks.push(chunk);
          } else if (typeof chunk === 'string') {
            chunks.push(Buffer.from(chunk));
          }
        }
        
        // Try to get the body if not already captured by res.json
        if (!res.locals.responseBody && chunks.length > 0) {
          try {
            const body = Buffer.concat(chunks).toString('utf8');
            if (body && body.trim().startsWith('{')) {
              res.locals.responseBody = JSON.parse(body);
            }
          } catch (e) {
            console.error('Error parsing response body:', e);
          }
        }
        
        // Call original end first
        const result = originalEnd.apply(res, args);
        
        // Then process our logic asynchronously
        Promise.resolve().then(async () => {
          // Rest of your existing code
          const isLoginEndpoint = req.path === '/auth/login';
          const isLogoutEndpoint = req.path === '/auth/logout';
          
          if (isLoginEndpoint && req.method === 'POST') {
            // Process login...
            try {
              // Your existing login handling
              const loginData = req.body as LoginDto | MfaLoginDto;
              const ipAddress = req.ip || 'unknown';
              const userAgent = req.headers['user-agent'] || '';
              
              // Get location and device info
              const locationData = await self.geoService.getLocationFromIp(ipAddress);
              const location = self.geoService.formatLocation(locationData);
              const device = self.deviceService.formatUserAgent(userAgent);
              
              // Status will be determined by response statusCode
              const status = res.statusCode < 400 ? 'Success' : 'Failed';
              
              // Get user if success
              let userId: string | null = null;
              if (status === 'Success') {
                const user = await self.prisma.user.findUnique({
                  where: { email: loginData.email },
                  select: { id: true }
                });
                userId = user?.id || null;
                
                // If successful login, create a session
                if (userId && res.statusCode === 200) {
                  // Get token from response body if available
                  let token = 'placeholder-token';
                  
                  if (res.locals.responseBody && res.locals.responseBody.accessToken) {
                    token = res.locals.responseBody.accessToken;
                  }
                  
                  const sessionExpiry = new Date();
                  sessionExpiry.setHours(sessionExpiry.getHours() + 24);
                  
                  await self.prisma.userSession.create({
                    data: {
                      userId,
                      token,
                      ipAddress,
                      userAgent,
                      device,
                      location,
                      type: 'Web',
                      expiresAt: sessionExpiry,
                    },
                  });
                }
              }
              
              // Rest of your existing code...
            } catch (error) {
              console.error('Error processing login:', error);
            }
          }
          
          // Rest of your existing middleware code...
        }).catch(err => {
          console.error('Error in auth logging middleware:', err);
        });
        
        return result;
      };
    }
    
    next();
  }
}