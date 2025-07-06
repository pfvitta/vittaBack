import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayloadDto } from '../dtos/jwtPayload.dto';

/**
 * Guarda personalizado que valida el JWT enviado en el encabezado Authorization.
 *
 * Reglas:
 * - Verifica que el encabezado Authorization comience con "Bearer".
 * - Valida el token usando la secret configurada en variables de entorno.
 * - Asigna el payload decodificado a la propiedad `request.user`.
 *
 * @throws UnauthorizedException si el token es inválido, expirado o está ausente.
 * @returns `true` si el token es válido y se puede continuar con la solicitud.
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 🔄 Extraer el objeto request de Express
    const request: Request = context.switchToHttp().getRequest<Request>();

    // 🔐 Leer el header de autorización
    const authHeader = request.headers.authorization;

    // 🚫 Validar que el header exista y comience con "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or malformed',
      );
    }

    // 🧩 Extraer el token desde el header
    const token = authHeader.split(' ')[1] ?? '';

    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }

    try {
      // 🔐 Verificar el token usando la secret del entorno
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new UnauthorizedException('JWT secret is not defined');
      }

      const payload = this.jwtService.verify<JwtPayloadDto>(token, { secret });

      // 🕒 (Opcional) Formatear las fechas para depuración
      payload.iat = new Date(Number(payload.iat) * 1000).toLocaleString();
      payload.exp = new Date(Number(payload.exp) * 1000).toLocaleString();

      // 📎 Asignar el payload al objeto request para usar en controladores o servicios
      request.user = payload;

      console.log('payload:', payload);

      // ✅ Token válido: permitir el acceso
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
