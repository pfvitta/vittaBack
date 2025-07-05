import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';
import { CreateAppointmentDto } from 'src/common/dtos/createAppointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Devuelve los turnos disponibles de un profesional para la fecha actual.
   * @param provider Objeto enviado por el cliente en el body con el professionalId.
   */
  @Post('validate')
  @ApiOperation({
    summary: 'Consultar disponibilidad',
    description:
      'Devuelve las franjas horarias disponibles hoy para un profesional.',
  })
  @ApiBody({ type: ValidateAppointmentDto })
  async validateAppointment(@Body() provider: ValidateAppointmentDto) {
    return await this.appointmentsService.validateAppointment(provider);
  }

  /**
   * Crea un nuevo turno para un usuario y profesional.
   * Valida previamente si el horario ya está ocupado.
   * @param appointments Datos del turno a crear.
   * @returns Turno registrado en la base de datos.
   */
  @Post('create')
  @ApiOperation({
    summary: 'Crear turno',
    description: 'Registra un nuevo turno si la franja horaria está libre.',
  })
  @ApiBody({ type: CreateAppointmentDto })
  @Post('create')
  async createAppointment(@Body() appointments: CreateAppointmentDto) {
    return await this.appointmentsService.createAppointment(appointments);
  }
}
