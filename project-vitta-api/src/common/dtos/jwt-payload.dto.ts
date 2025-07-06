// src/common/dto/jwt-payload.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class JwtPayloadAuth0Dto {
  @ApiProperty({
    example: 'https://dev-xxxxxx.us.auth0.com/',
    description: 'Issuer (dominio de Auth0)',
  })
  @IsUrl()
  iss: string;

  @ApiProperty({
    example: 'auth0|1234567890',
    description: 'Subject - ID del usuario o aplicación',
  })
  @IsString()
  sub: string;

  @ApiProperty({
    example: 'https://dev-q0aqr87w7eu1wqet.us.auth0.com/api/v2/',
    description: 'Audiencia del token (API Identifier)',
  })
  @IsString()
  aud: string | string[];

  @ApiProperty({
    example: 1751345089,
    description: 'Fecha de expiración en formato UNIX timestamp',
  })
  @IsNumber()
  exp: number;

  @ApiProperty({
    example: 1751258689,
    description: 'Fecha de emisión del token en formato UNIX timestamp',
  })
  @IsNumber()
  iat: number;

  @ApiProperty({
    example: 'oJLrICb5QEP1dK93jDZ6rxdtGzpjr7CY',
    description: 'Authorized party (azp)',
    required: false,
  })
  @IsOptional()
  @IsString()
  azp?: string;

  @ApiProperty({
    example: 'client-credentials',
    description: 'Grant type usado para obtener el token',
    required: false,
  })
  @IsOptional()
  @IsString()
  gty?: string;

  @ApiProperty({
    example: 'read:users write:appointments',
    description: 'Scope del token',
    required: false,
  })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiProperty({
    example: ['read:users', 'write:appointments'],
    description: 'Lista de permisos (si se usa RBAC)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiProperty({
    example: 'admin',
    description: 'Rol personalizado',
    required: false,
  })
  @IsOptional()
  @IsString()
  ['https://vitta.com/role']?: string;

  @ApiProperty({
    example: ['admin'],
    description: 'Lista de roles normalizada para el backend',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
