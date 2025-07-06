// src/types/express.d.ts
import { JwtPayloadDto } from '../common/dtos/jwtPayload.dto';
import { JwtPayloadAuth0Dto } from '../common/dtos/jwt-payload.dto';

declare module 'express' {
  interface Request {
    user?: JwtPayloadDto | JwtPayloadAuth0Dto;
  }
}
