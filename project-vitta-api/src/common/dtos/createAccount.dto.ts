import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsPhoneNumber,
  IsDateString,
  IsBoolean,
  Matches,
  IsOptional,
  IsUrl,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  // ==== Campos comunes para todos los usuarios ====

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  fullName: string;

  @ApiProperty({ example: 'correo@ejemplo.com' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @ApiProperty({ example: 'Abcde#123' })
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

  @ApiProperty({ example: '+49123456789' })
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsPhoneNumber(undefined, {
    message: 'Debe ser un número de teléfono válido',
  })
  phone: string;

  @ApiProperty({ example: 'CC' })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  @IsString({ message: 'El tipo de documento debe ser texto' })
  @Length(2, 10, {
    message: 'El tipo de documento debe tener entre 2 y 10 caracteres',
  })
  documentType: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @Matches(/^\d{5,10}$/, {
    message: 'El número de documento debe tener entre 5 y 10 dígitos',
  })
  documentNumber: string;

  @ApiProperty({ example: 'https://s3.com/front.jpg' })
  @IsNotEmpty({ message: 'La URL del documento frontal es obligatoria' })
  @IsString({ message: 'Debe ser una URL válida' })
  documentFrontUrl: string;

  @ApiProperty({ example: 'https://s3.com/back.jpg' })
  @IsNotEmpty({ message: 'La URL del documento trasero es obligatoria' })
  @IsString({ message: 'Debe ser una URL válida' })
  documentBackUrl: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsNotEmpty({ message: 'El lugar de expedición es obligatorio' })
  @IsString({ message: 'El lugar de expedición debe ser texto' })
  @Length(2, 40, { message: 'Debe tener entre 2 y 40 caracteres' })
  documentIssuedPlace: string;

  @ApiProperty({ example: '1993-08-15' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  birthDate: Date;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  @IsNotEmpty({ message: 'El estado activo es obligatorio' })
  isActive: boolean;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  role: string;

  // ==== Campos opcionales del perfil profesional ====

  @ApiProperty({ example: 'Experto en nutrición...', required: false })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser texto' })
  @Length(10, 1000, {
    message: 'La biografía debe tener entre 10 y 1000 caracteres',
  })
  biography?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: 'El valor de validado debe ser booleano' })
  isVerified?: boolean;

  @ApiProperty({ example: 'UUID del admin', required: false })
  @IsOptional()
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  verifiedBy?: string;

  @ApiProperty({ example: '10 años de experiencia...', required: false })
  @IsOptional()
  @IsString({ message: 'La experiencia debe ser texto' })
  @Length(10, 1000, {
    message: 'La experiencia debe tener entre 10 y 1000 caracteres',
  })
  experience?: string;

  @ApiProperty({ example: 85000, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  consultationPrice?: number;

  @ApiProperty({ example: 'https://cdn.com/front.jpg', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  professionalCardFrontUrl?: string;

  @ApiProperty({ example: 'https://cdn.com/back.jpg', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  professionalCardBackUrl?: string;
}
