import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '7c2e08de-40e7-4edb-9e87-017e3e159c30',
    description: 'UUID v4 del paciente que solicita el turno',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', {
    message: 'El ID del usuario debe ser un UUID versión 4 válido',
  })
  userId: string;

  @ApiProperty({
    example: 'e1c7e1fd-bd65-4f95-93d2-fb6b64ec5a1f',
    description: 'UUID v4 del profesional que atiende el turno',
  })
  @IsNotEmpty({ message: 'El ID del profesional es obligatorio' })
  @IsUUID('4', {
    message: 'El ID del profesional debe ser un UUID versión 4 válido',
  })
  professionalId: string;

  @ApiProperty({
    example: '2025-07-10',
    description: 'Fecha agendada del turno (formato YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'La fecha del turno es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  date: Date;

  @ApiProperty({
    example: '14:00:00',
    description: 'Hora del turno en formato HH:mm (24h)',
  })
  @IsNotEmpty({ message: 'La hora del turno es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe estar en formato HH:mm (24 horas)',
  })
  time: string;

  @ApiProperty({
    example: 'pending',
    description:
      "Estado actual del turno: 'pending', 'confirmed', 'cancelled' o 'completed'",
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @Matches(/^(pending|confirmed|cancelled|completed)$/, {
    message:
      "El estado debe ser: 'pending', 'confirmed', 'cancelled' o 'completed'",
  })
  status: string;
}
