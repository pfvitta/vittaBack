// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Leer el token del header
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Usa tu clave secreta de .env
    });
  }

  async validate(payload: any) {
    // Lo que devuelvas aquí será asignado a req.user
    return { email: payload.email, id: payload.id, role: payload.role };
  }
}
