// src/common/guards/jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class JwtGuard implements CanActivate {
  // Configura el middleware de Auth0 directamente
  private jwtCheck = auth({
    audience: 'https://vitta-api.com', // 👈 Tu API Identifier en Auth0
    issuerBaseURL: 'https://dev-q0aqr87w7eu1wqet.us.auth0.com/', // 👈 Tu dominio de Auth0
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const payload = await new Promise<JwtPayloadDto>((resolve, reject) => {
      this.jwtCheck(req, res, (err) => {
        if (err) return reject(new Error(`Token inválido o expirado, ${err}`));

        const payload = req.auth?.payload;

        if (!payload)
          return reject(new Error('No se encontró el payload en el token'));

        resolve(payload as JwtPayloadDto);
      });
    });

    // Validar y guardar el payload
    const dto = plainToInstance(JwtPayloadDto, payload);
    await validateOrReject(dto);
    req['user'] = dto;

    return true;
  }
}
