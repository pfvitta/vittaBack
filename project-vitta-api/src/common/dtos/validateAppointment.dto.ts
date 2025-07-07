import { PickType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './createAppointment.dto';

export class ValidateAppointmentDto extends PickType(CreateAppointmentDto, [
  'professionalId',
  'date',
]) {}
