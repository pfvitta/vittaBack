import { ApiProperty } from '@nestjs/swagger';

// DTO para cada elemento del array
class AvailableHourItemDto {
  @ApiProperty({
    example: '08:00:00',
    description: 'Hora disponible en formato HH:MM:ss',
  })
  hourHand: string; // Cada item es un string, no un array
}

// DTO para la respuesta completa (array de AvailableHourItemDto)
export class AvailableHourDto {
  @ApiProperty({
    type: [AvailableHourItemDto], // ¡Clave aquí! Indica que es un array de AvailableHourItemDto
    example: [{ hourHand: '08:00:00' }, { hourHand: '09:00:00' }],
    description: 'Lista de horas disponibles',
  })
  availableHours: AvailableHourItemDto[]; // Propiedad que contiene el array
}
