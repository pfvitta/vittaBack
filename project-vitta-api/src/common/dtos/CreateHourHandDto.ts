import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class CreateHourHandDto {
  @ApiProperty({
    description: 'Hora en formato HH:MM (24 horas)',
    example: '08:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hourHand debe estar en formato HH:MM',
  })
  hourHand: string;
}
