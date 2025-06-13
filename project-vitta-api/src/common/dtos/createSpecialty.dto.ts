import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({
    example: 'Nutrición clínica',
    description: 'Nombre único de la especialidad médica o profesional',
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la especialidad es obligatorio' })
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  name: string;

  @ApiProperty({
    example:
      'Especialidad enfocada en el tratamiento dietético de enfermedades.',
    description: 'Descripción detallada de la especialidad',
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;
}
