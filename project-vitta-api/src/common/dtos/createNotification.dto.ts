import { IsNotEmpty, IsUUID, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'be12c66c-ef29-4ea9-b332-f48a4826f101',
    description: 'UUID v4 del usuario que recibe la notificación',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  userId: string;

  @ApiProperty({
    example: 'recordatorio',
    description: 'Tipo de notificación o evento (máx. 20 caracteres)',
  })
  @IsNotEmpty({ message: 'El tipo de notificación es obligatorio' })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @Length(3, 20, {
    message: 'El tipo debe tener entre 3 y 20 caracteres',
  })
  type: string;

  @ApiProperty({
    example: 'Tienes una cita programada para mañana a las 10:00 AM',
    description: 'Contenido detallado de la notificación',
  })
  @IsNotEmpty({ message: 'El mensaje de la notificación es obligatorio' })
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  @Length(5, 1000, {
    message: 'El mensaje debe tener entre 5 y 1000 caracteres',
  })
  message: string;
}
