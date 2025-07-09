import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';
import { CreateAppointmentDto } from 'src/common/dtos/createAppointment.dto';
import { AvailableHourDto } from '../common/dtos/horus.dto';
import { Appointment } from '../common/entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('user')
  async userShiftHistory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.userShiftHistory(id);
  }

  @Get('provider')
  async providerShiftHistory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.providerShiftHistory(id);
  }

  /**
   * Devuelve los turnos disponibles de un profesional para la fecha actual.
   * @param provider Objeto enviado por el cliente en el body con el professionalId.
   */
  @Post('validate')
  @ApiOperation({
    summary: 'Consultar horarios disponibles para hoy',
    description:
      'Devuelve los horarios libres de un profesional para la fecha actual. No permite turnos los fines de semana.',
  })
  @ApiResponse({
    status: 201,
    description: 'Horarios disponibles retornados con éxito.',
    type: AvailableHourDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Solo se permiten turnos de lunes a viernes.',
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
  @ApiResponse({
    status: 201,
    description: 'Turno creado exitosamente',
    type: Appointment, // o AppointmentResponseDto si prefieres DTOs para respuesta
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (fecha u hora fuera del rango permitido)',
  })
  @ApiResponse({
    status: 404,
    description: 'Ya existe un turno en esa franja horaria',
  })
  @ApiBody({ type: CreateAppointmentDto })
  async createAppointment(@Body() appointments: CreateAppointmentDto) {
    console.log (appointments);
    return await this.appointmentsService.createAppointment(appointments);
  }
}
