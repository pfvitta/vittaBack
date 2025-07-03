import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsDateString,
  IsNumber,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMembershipDto {
  @ApiProperty({
    example: '9f0b6d67-ff3b-4c2d-8c6e-8f45c10eaa11',
    description: 'UUID v4 del paciente que adquiere la membresía',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID versión 4 válido' })
  userId: string;

  @ApiProperty({
    example: 'mensual',
    description: "Tipo de membresía (ej: 'mensual', 'premium')",
  })
  @IsNotEmpty({ message: 'El tipo de membresía es obligatorio' })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @Length(3, 20, {
    message: 'El tipo debe tener entre 3 y 20 caracteres',
  })
  type: string;

  @ApiProperty({
    example: 'Active',
    description: "Estado actual de la membresía (ej: 'Active', 'Inactive')",
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @Matches(/^(Active|Inactive)$/, {
    message: "El estado debe ser 'activa' o 'vencida'",
  })
  status: string;

  @ApiProperty({
    example: '2025-06-01',
    description: 'Fecha de inicio de la membresía (formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  startDate: Date;

  @ApiProperty({
    example: '2025-07-01',
    description: 'Fecha de finalización de la membresía (formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  endDate: Date;

  @ApiProperty({
    example: 49900,
    description: 'Valor total pagado por la membresía',
  })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  price: number;
}
