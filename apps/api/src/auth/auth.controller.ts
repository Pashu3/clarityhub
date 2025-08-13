import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
  Patch,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,  
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EnableMfaDto, VerifyMfaDto, MfaLoginDto, RecoverMfaDto } from './dto/mfa-login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RtGuard } from './refresh-token.guard';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Role } from '@prisma/client';


@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mfaService: MfaService
  ) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email/password and optional MFA' })
  @ApiBody({ type: MfaLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 403, description: 'Invalid credentials' })
  login(@Body() dto: MfaLoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  refresh(
    @Req()
    req: Request & {
      user: { sub: string; refreshToken: string };
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mfa/generate')
  @ApiOperation({ summary: 'Generate MFA secret and QR code' })
  async generateMfaSecret(@Req() req) {
    return this.mfaService.generateMfaSecret(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  @ApiOperation({ summary: 'Verify MFA token and enable MFA' })
  async verifyMfa(@Req() req, @Body() dto: VerifyMfaDto) {
    const isValid = await this.mfaService.verifyMfaToken(req.user.sub, dto.token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    // Enable MFA and return backup codes
    const backupCodes = await this.mfaService.enableMfa(req.user.sub);
    return {
      success: true,
      backupCodes
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('mfa/toggle')
  @ApiOperation({ summary: 'Enable or disable MFA' })
  async toggleMfa(@Req() req, @Body() dto: EnableMfaDto) {
    const userId = req.user.sub;

    // Check if the user is admin, as admins must have MFA
    const user = await this.authService.getMe(userId);

    // Add null check before accessing user.role
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!dto.enable && (user.role === Role.ADMIN || user.role === Role.SUPERADMIN)) {
      throw new ForbiddenException('MFA is required for admin accounts');
    }

    if (dto.enable) {
      // Generate and return MFA setup info
      return this.mfaService.generateMfaSecret(userId);
    } else {
      // Disable MFA
      await this.mfaService.disableMfa(userId);
      return { success: true };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('mfa/recover')
  @ApiOperation({ summary: 'Recover account access using backup code' })
  async recoverWithBackupCode(
    @Req() req,
    @Body() dto: RecoverMfaDto
  ) {
    const success = await this.mfaService.recoverAccountWithBackupCode(
      req.user.sub,
      dto.backupCode
    );

    if (!success) {
      throw new UnauthorizedException('Invalid backup code');
    }

    return { success: true };
  }

  @Post('logout')
  async logout(
    @Req()
    req: Request & {
      user?: { sub: string };
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    // Clear cookies
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.clearCookie('user_info');
    
    // If we have user info, also invalidate their tokens in the database
    if (req.user?.sub) {
      await this.authService.logout(req.user.sub);
    }
    
    return { message: 'Logged out successfully' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() { }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { user, tokens } = req.user as any;
    console.log('Google user:', user);
    console.log('Google tokens:', tokens);
  
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });
    
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15, 
    });
  
    res.cookie('user_info', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isAuthenticated: true
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, 
    });
  
    return res.redirect(`${process.env.FRONTEND_URL}/menu/dashboard`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return this.authService.getMe(req.user.sub);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req, @Body() data: any) {
    return this.authService.updateProfile(req.user.sub, data);
  }
  
  @Get('status')
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 200, description: 'Authentication status' })
  async checkAuthStatus(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      let token = null;
      
      if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
      } else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
      
      if (!token) {
        return { isAuthenticated: false };
      }
      
      const authStatus = await this.authService.verifyAuthStatus(token, req.cookies?.refreshToken);
      
      if (authStatus && 'newAccessToken' in authStatus && authStatus.newAccessToken) {
        res.cookie('accessToken', authStatus.newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000, // 15 minutes
          path: '/',
        });
        
        const { newAccessToken, ...safeAuthStatus } = authStatus;
        return safeAuthStatus;
      }
      
      return authStatus;
    } catch (error) {
      console.error('Auth status error:', error);
      return { isAuthenticated: false, error: 'Failed to verify authentication status' };
    }
  }
}