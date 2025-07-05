import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateAppointmentDto {
  @ApiProperty({
    example: 'efbaee97-0094-4e10-91a7-68c2f4a13855',
    description: 'UUID v4 del profesional para validar sus turnos',
  })
  @IsUUID('4')
  professionalId: string;
}
