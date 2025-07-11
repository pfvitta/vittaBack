import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Auth0Guard
 * Protege rutas verificando si el usuario está autenticado vía Auth0
 * usando express-openid-connect (`req.oidc.isAuthenticated()`).
 */
@Injectable()
export class Auth0Guard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // Verificar si el usuario está autenticado por Auth0
    if (!req.oidc.isAuthenticated()) {
      throw new UnauthorizedException('Not authenticated');
    }
    return true;
  }
}
