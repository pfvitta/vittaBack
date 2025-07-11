import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class JwtPayloadDto {
  @ApiProperty({
    example: 'auth0|abcd1234',
    description: 'ID del sujeto (sub)',
  })
  @IsString()
  sub: string;

  @ApiProperty({
    example: 'b3a2e63a-1d63-4d91-80c3-99c72a91ebd3',
    description: 'ID interno del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'correo@ejemplo.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'admin',
    enum: Role,
    description: 'Rol del usuario',
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  roles?: Role;

  @ApiProperty({
    example: '2025-07-05 17:00:00',
    description: 'Issued at (fecha legible)',
    required: false,
  })
  @IsOptional()
  @IsString()
  iat?: string;

  @ApiProperty({
    example: '2025-07-06 17:00:00',
    description: 'Expiración legible',
    required: false,
  })
  @IsOptional()
  @IsString()
  exp?: string;
}
