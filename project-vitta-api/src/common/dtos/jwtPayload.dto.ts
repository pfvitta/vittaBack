import { Role } from '../enums/roles.enum';

export class JwtPayloadDto {
  sub: string;
  id?: string;
  email: string;
  roles?: Role;
  iat?: string;
  exp?: string;
}
