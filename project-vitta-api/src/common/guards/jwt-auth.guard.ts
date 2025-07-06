// src/common/guards/jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { JwtPayloadAuth0Dto } from '../dtos/jwt-payload.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

/**
 * Guarda personalizado que protege rutas mediante JWT emitidos por Auth0.
 *
 * Funcionalidades:
 * - Usa el middleware oficial de `express-oauth2-jwt-bearer` para validar el token.
 * - Extrae el payload del token JWT y lo valida con DTO.
 * - Inserta el payload validado en `request.user` para su uso posterior.
 */

@Injectable()
export class JwtGuard implements CanActivate {
  // 🔐 Configura el middleware con tu dominio y audiencia de Auth0
  private jwtCheck = auth({
    audience: 'https://dev-q0aqr87w7eu1wqet.us.auth0.com/api/v2/', // 👈 Tu API Identifier en Auth0
    issuerBaseURL: 'https://dev-q0aqr87w7eu1wqet.us.auth0.com/', // 👈 Tu dominio de Auth0
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    // 🔍 Ejecuta el middleware de Auth0 para validar el JWT
    const payload = await new Promise<JwtPayloadAuth0Dto>((resolve, reject) => {
      this.jwtCheck(req, res, (err) => {
        if (err) return reject(new Error(`Token inválido o expirado, ${err}`));

        const payload = req.auth?.payload;

        if (!payload)
          return reject(new Error('No se encontró el payload en el token'));

        resolve(payload as JwtPayloadAuth0Dto);
      });
    });

    // ✅ Transforma y valida el payload con class-validator
    const dto = plainToInstance(JwtPayloadAuth0Dto, payload);
    await validateOrReject(dto);

    // Extraer los roles desde la claim personalizada
    (dto as any).roles = [payload['https://vitta.com/role']];

    // 📎 Asigna el payload validado a `req.user`
    req['user'] = dto;

    return true;
  }
}
