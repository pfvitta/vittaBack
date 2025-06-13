import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateRecoverPasswordDto {
  @ApiProperty({
    example: 'e3f15689-7db5-4b93-9dc0-9a3e92b2b761',
    description: 'UUID v4 del usuario que solicita la recuperación',
  })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  userId: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f6g7h8i9j0',
    description: 'Token único para restablecer la contraseña',
  })
  @IsString({ message: 'El token debe ser texto' })
  @Length(10, 200, { message: 'El token debe tener entre 10 y 200 caracteres' })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  token: string;

  @ApiProperty({
    example: '2025-07-01',
    description: 'Fecha de vencimiento del token',
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  expiration: Date;
}
