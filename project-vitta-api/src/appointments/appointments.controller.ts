import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';
import { CreateAppointmentDto } from 'src/common/dtos/createAppointment.dto';
import { AvailableHourDto } from '../common/dtos/horus.dto';
import { Appointment } from '../common/entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Obtiene el historial de turnos asignados a un usuario.
   *
   * @param id - ID del usuario en formato UUID.
   * @returns Lista de turnos agendados por el usuario.
   * @throws NotFoundException si el usuario no tiene turnos registrados.
   */
  @Get('user/:id')
  @ApiOperation({
    summary: 'Historial de turnos del usuario',
    description:
      'Obtiene todos los turnos agendados por un usuario específico, filtrados por su ID (UUID). Retorna una lista de citas pasadas y futuras.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del usuario en formato UUID',
    example: '5a6c7d8e-1234-5678-90ab-1234567890cd',
  })
  async userShiftHistory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.userShiftHistory(id);
  }

  /**
   * Obtiene el historial de turnos asignados a un profesional.
   *
   * @param id - ID del profesional (UUID v4).
   * @returns Lista de turnos que tiene asignados el profesional.
   * @throws NotFoundException si no tiene turnos.
   */
  @Get('provider/:id')
  @ApiOperation({
    summary: 'Historial de turnos del profesional',
    description:
      'Retorna todos los turnos agendados por un profesional específico identificado por su UUID.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID del profesional en formato UUID',
    example: 'b6a4f29d-1234-4fd1-8abc-76e23d9d455f',
  })
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
    console.log('[BACKEND] Payload recibido:', appointments);
    return this.appointmentsService.createAppointment(appointments);
  }

  @Patch('cancel/:id')
  async cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.cancelAppointment(id);
  }

  @Patch('provider/confirm/:id')
  async confirmAppointment(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.confirmAppointment(id);
  }
}