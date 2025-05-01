import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RtGuard } from './refresh-token.guard';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'; 

@ApiTags('Auth') 
@ApiBearerAuth() 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
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

  @Post('logout')
  async logout(
    @Req()
    req: Request & {
      user?: { sub: string };
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = req.user as any;

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      message: 'Login successful with Google',
      access_token: tokens.access_token,
      user,
    };
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
}