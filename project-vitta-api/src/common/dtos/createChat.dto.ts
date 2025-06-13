import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    example: 'a46a9d77-891e-4dc2-b768-2b1b6e9623cf',
    description: 'UUID v4 del paciente que participa en el chat',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', {
    message: 'El ID del usuario debe ser un UUID versión 4 válido',
  })
  userId: string;

  @ApiProperty({
    example: 'be7259a1-dc32-4e8b-8d13-54d2173ac789',
    description: 'UUID v4 del profesional que participa en el chat',
  })
  @IsNotEmpty({ message: 'El ID del profesional es obligatorio' })
  @IsUUID('4', {
    message: 'El ID del profesional debe ser un UUID versión 4 válido',
  })
  professionalId: string;
}
