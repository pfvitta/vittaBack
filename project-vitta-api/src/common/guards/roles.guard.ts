import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 🔄 Extraer el objeto request de Express
    const request: Request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    const hasRole = () =>
      requireRoles.some((rol) => user?.roles?.includes(rol));

    const valid = user && user.roles && hasRole();

    if (!valid) {
      throw new ForbiddenException(
        'You do not have permission and aaere not allowed to acces this route',
      );
    }

    return valid;
  }
}
