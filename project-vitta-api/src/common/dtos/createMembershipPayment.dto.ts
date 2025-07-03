import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMembershipPaymentDto {
  @ApiProperty({
    example: 'f3d2e9c6-77e1-4f8d-a4cb-8c1c7951db8e',
    description: 'UUID v4 de la membresía asociada al pago',
  })
  @IsNotEmpty({ message: 'El ID de la membresía es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID versión 4 válido' })
  membershipId: string;

  @ApiProperty({
    example: 49900,
    description: 'Valor pagado por la membresía',
  })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  price: number;

  @ApiProperty({
    example: 'tarjeta',
    description:
      'Método de pago utilizado (ej: tarjeta, transferencia, efectivo)',
  })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @Length(3, 15, {
    message: 'El método de pago debe tener entre 3 y 15 caracteres',
  })
  paymentMethod: string;
}
