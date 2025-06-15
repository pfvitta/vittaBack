import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = request.headers['authorization']?.split(' ')[1] ?? '';

    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }

    try {
      const secret = process.env.JWT_SECRET;

      const payload = this.jwtService.verify(token, { secret });

      //request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
