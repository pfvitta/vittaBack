import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsPhoneNumber,
  IsDateString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario (3 a 100 caracteres)',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name: string;

  @ApiProperty({
    example: 'correo@ejemplo.com',
    description: 'Correo electrónico único del usuario',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @ApiProperty({
    example: 'Abcde#123',
    description:
      'Contraseña segura de 6 a 15 caracteres, con una mayúscula, un número y un carácter especial',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Length(6, 15, {
    message: 'La contraseña debe tener entre 6 y 15 caracteres',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message:
      'La contraseña debe tener al menos una mayúscula, un número y un carácter especial',
  })
  password: string;

  @ApiProperty({
    example: '+573001112233',
    description:
      'Número de teléfono celular del usuario (formato internacional)',
  })
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsPhoneNumber('CO', {
    message: 'Debe ser un número de teléfono colombiano válido',
  })
  phone: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Número de documento único (5 a 10 dígitos)',
  })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @Matches(/^\d{5,10}$/, {
    message: 'El número de documento debe tener entre 5 y 10 dígitos',
  })
  dni: string;

  @ApiProperty({
    example: 'Bogotá',
    description: 'Ciudad de recidencia',
  })
  @IsNotEmpty({ message: 'La ciudad de residencia es obligatorio' })
  @IsString({ message: 'La ciudad de residencia debe ser texto' })
  @Length(2, 50, { message: 'Debe tener entre 2 y 50 caracteres' })
  city: string;

  @ApiProperty({
    example: '1993-08-15',
    description: 'Fecha de nacimiento del usuario (formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  dob: Date;

  @ApiProperty({
    example: 'user',
    description: 'Rol del usuario (ej: admin, profesional, user)',
  })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  role: string;
}
