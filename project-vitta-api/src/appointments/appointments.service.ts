import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from 'src/common/dtos/createAppointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import data from '../../data.json';

@Injectable()
export class AppointmentsService {
  private readonly horus = data;
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  /**
   * Valida los horarios disponibles de un profesional para la fecha actual.
   * Retorna la lista de horarios no ocupados basándose en un JSON estático de referencia.
   *
   * @param provider - Objeto con el ID del profesional.
   * @returns Horas disponibles para agendamiento en la fecha actual.
   */
  async validateAppointment(provider: { professionalId: string }) {
    const hoy = new Date();
    const formatteddate = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    ); // sin hora, en local

    console.log(formatteddate); // ejemplo: 2025-07-05T00:00:00.000-05:00
    console.log(provider.professionalId);

    const datosConsulta = {
      professionalId: provider.professionalId,
      date: formatteddate,
    };

    const validatedate =
      await this.appointmentsRepository.validateAppointmentProfessional(
        datosConsulta,
      );
    console.log('validatedate', validatedate);

    if (!validatedate) {
      return this.horus;
    }

    const horasOcupadas = validatedate.map((turno) => turno.time);

    console.log(horasOcupadas);

    return this.horus.filter((hora) => !horasOcupadas.includes(hora.hourHand));
  }

  /**
   * Crea un nuevo turno para un usuario con un profesional en una franja horaria.
   * Valida previamente si ese turno ya está ocupado.
   *
   * @param appointments - Datos del turno a crear.
   * @throws NotFoundException si ya hay un turno con la misma fecha, hora y participantes.
   * @returns Turno creado exitosamente.
   */
  async createAppointment(appointments: CreateAppointmentDto) {
    const fecha = new Date(appointments.date);
    const formatteddate = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    ); // sin hora, en local

    appointments.date = formatteddate;

    const validateHorus =
      await this.appointmentsRepository.validateAppointment(appointments);
    if (validateHorus) {
      throw new NotFoundException('No hay disponibilidad para esa franja');
    }

    return await this.appointmentsRepository.createAppointment(appointments);
  }
}
