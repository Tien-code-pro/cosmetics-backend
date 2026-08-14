import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AdminRole } from 'generated/prisma/enums';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-this-secret-later',
    });
  }

  async validate(payload: { sub: string; email: string; role: AdminRole }) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
