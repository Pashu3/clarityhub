import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Provider } from '@prisma/client'; 

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ForbiddenException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        provider: Provider.CREDENTIALS, 
      },
    });

    return this.signTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new ForbiddenException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new ForbiddenException('Invalid credentials');

    return this.signTokens(user.id, user.email);
  }

  async signTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
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
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const isMatch = await bcrypt.compare(rt, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.signTokens(user.id, user.email);
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

  async logout(userId: string) {
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
    return this.prisma.user.findUnique({
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
      },
    });
  }

  async updateProfile(userId: string, data: { name?: string; picture?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}