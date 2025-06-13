import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsBoolean,
  IsNumber,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalProfileDto {
  @ApiProperty({
    example: '88b9c4b1-e7d2-4c15-a8df-92f1eeb8a55e',
    description: 'UUID v4 del usuario que crea el perfil profesional',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  usuarioId: string;

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
  biografia: string;

  @ApiProperty({
    example: false,
    description: 'Indica si el perfil fue validado manualmente',
  })
  @IsBoolean({ message: 'El valor de validado debe ser booleano' })
  validado: boolean;

  @ApiProperty({
    example: 'b5a02a7f-508d-4451-83b6-4d42fa515b12',
    description: 'UUID v4 del administrador que validó el perfil',
  })
  @IsNotEmpty({ message: 'El ID del validador es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  verificadoPor: string;

  @ApiProperty({
    example:
      'Más de 8 años de experiencia en consulta privada y clínica hospitalaria.',
    description: 'Experiencia profesional del usuario',
  })
  @IsNotEmpty({ message: 'La experiencia es obligatoria' })
  @IsString({ message: 'La experiencia debe ser texto' })
  @Length(10, 1000, {
    message: 'La experiencia debe tener entre 10 y 1000 caracteres',
  })
  experiencia: string;

  @ApiProperty({
    example: 85000,
    description: 'Precio por consulta en pesos colombianos',
  })
  @IsNotEmpty({ message: 'El precio por consulta es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  precioConsulta: number;

  @ApiProperty({
    example: 'https://cdn.example.com/docs/tarjeta_frente.jpg',
    description: 'URL frontal de la tarjeta profesional',
  })
  @IsNotEmpty({ message: 'La URL frontal de la tarjeta es obligatoria' })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  tarjetaProfesionalFrontalUrl: string;

  @ApiProperty({
    example: 'https://cdn.example.com/docs/tarjeta_trasera.jpg',
    description: 'URL trasera de la tarjeta profesional',
  })
  @IsNotEmpty({ message: 'La URL trasera de la tarjeta es obligatoria' })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  tarjetaProfesionalTraseraUrl: string;
}
