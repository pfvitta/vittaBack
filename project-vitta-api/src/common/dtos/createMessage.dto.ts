import { IsNotEmpty, IsUUID, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    example: '4b05d536-31ee-467f-8f1c-43a5b61a39cb',
    description: 'UUID v4 del chat asociado al mensaje',
  })
  @IsNotEmpty({ message: 'El ID del chat es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  chatId: string;

  @ApiProperty({
    example: '7a71f5ac-c5b9-41d2-a267-0efc902129f9',
    description: 'UUID v4 del remitente del mensaje',
  })
  @IsNotEmpty({ message: 'El ID del remitente es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  senderId: string;

  @ApiProperty({
    example: 'Hola, ¿cómo estás?',
    description: 'Contenido textual del mensaje',
  })
  @IsNotEmpty({ message: 'El contenido del mensaje es obligatorio' })
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @Length(1, 1000, {
    message: 'El contenido debe tener entre 1 y 1000 caracteres',
  })
  content: string;
}
