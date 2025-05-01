import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(JwtStrategy, 'jwt-refresh') {
  constructor() {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,
    };

    super(options);
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization')?.replace('Bearer ', '').trim();
    return { ...payload, refreshToken };
  }
}
