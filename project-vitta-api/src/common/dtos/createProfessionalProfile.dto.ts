import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '../entities/specialty.entity';

export class CreateProfessionalProfileDto {
  @ApiProperty({
    example:
      'Nutricionista con 10 años de experiencia en pacientes diabéticos.',
    description: 'Biografía profesional del usuario',
  })
  @IsNotEmpty({ message: 'La biografía es obligatoria' })
  @IsString({ message: 'La biografía debe ser texto' })
  @Length(10, 1000, {
    message: 'La biografía debe tener entre 10 y 1000 caracteres',
  })
  biography?: string;

  @ApiProperty({
    example:
      'Más de 8 años de experiencia en consulta privada y clínica hospitalaria.',
    description: 'Experiencia profesional del usuario',
  })
  @IsNotEmpty({ message: 'La experiencia es obligatoria' })
  @IsString({ message: 'La experiencia debe ser texto' })
  @Length(10, 500, {
    message: 'La experiencia debe tener entre 10 y 1000 caracteres',
  })
  experience?: string;

  @ApiProperty({
    description: 'Número de matrícula profesional',
    example: 'AB-12345',
    required: false,
  })
  @IsString({ message: 'El número de matrícula debe ser una cadena de texto.' })
  @Length(6, 20, {
    message: 'El número de matrícula debe tener entre 6 y 20 caracteres.',
  })
  licenseNumber?: string;

  @ApiProperty({
    description: 'Área de especialización',
    example: 'DIABETES',
  })
  @IsString({
    each: true,
    message: 'Cada especialidad debe ser un texto válido',
  })
  specialty?: Specialty[];
}
