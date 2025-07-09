import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from 'src/common/dtos/createAppointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import data from '../../data.json';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';

@Injectable()
export class AppointmentsService {
  // Horarios base que se usarán para mostrar disponibilidad
  private readonly horus = data;

  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  /**
   * Valida los horarios disponibles de un profesional para la fecha actual (hoy).
   * Se ejecuta al oprimir el botón "Agendar turno" y devuelve los horarios aún libres.
   *
   * Reglas:
   * - Solo permite agendamientos de lunes a viernes.
   * - Filtra los horarios ya ocupados para evitar duplicidad de turnos.
   *
   * @param provider - DTO con el ID del profesional (UUID v4).
   * @returns Arreglo de objetos con los horarios disponibles para hoy.
   */
  async validateAppointment(provider: ValidateAppointmentDto) {
    const fecha = new Date(provider.date);

    // 🚫 Validación: No se permiten turnos fuera del horario laboral ni fines de semana
    const dia = fecha.getDay(); // Domingo: 0, Sábado: 6

    console.log(dia);

    if (dia === 0 || dia === 6) {
      throw new BadRequestException({
        alert: 'Turno fuera del horario hábil',
        errors: [
          {
            field: 'date',
            message:
              'Los turnos solo pueden agendarse de lunes a viernes, entre las 08:00 y las 17:00 horas.',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    // 📆 Fecha formateada sin hora (YYYY-MM-DD en local)
    const formatteddate = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );

    provider.date = formatteddate;

    // 🔍 Buscar turnos ya tomados por el profesional en la fecha actual
    const validatedate =
      await this.appointmentsRepository.validateAppointmentProfessional(
        provider,
      );

    // ✅ Si no hay turnos aún, devolver todos los horarios disponibles
    if (!validatedate || validatedate.length === 0) {
      return this.horus;
    }

    // 🕒 Extraer horas ya ocupadas
    const horasOcupadas = validatedate.map((turno) => turno.time);

    // 🟢 Retornar solo las horas que aún no están ocupadas
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
    const hoy = new Date();

    // 🚫 Validación: No se permiten turnos fuera del horario laboral ni fines de semana
    const hora = appointments.time;

    const dia = fecha.getDay(); // Domingo: 0, Sábado: 6

    if (
      hora < '8:00' ||
      hora > '17:00' ||
      dia === 0 ||
      dia === 6 ||
      fecha.toDateString() < hoy.toDateString()
    ) {
      throw new BadRequestException({
        alert: 'Turno fuera del horario hábil',
        errors: [
          {
            field: 'date',
            message:
              'Los turnos solo pueden agendarse de lunes a viernes, entre las 08:00 y las 17:00 horas.',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    // 🕒 Validar que la hora enviada coincida con una franja horaria permitida
    const isHoraValida = this.horus.some(
      (h) => h.hourHand === appointments.time,
    );

    if (!isHoraValida) {
      throw new BadRequestException({
        alert: 'Hora inválida',
        errors: [
          { field: 'time', message: 'La hora no es una franja permitida' },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    // 🧼 Formatear la fecha (sin hora)
    const formatteddate = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    ); // sin hora, en local

    appointments.date = formatteddate;

    // 🔍 Validar si ya existe el turno
    const validateHorus =
      await this.appointmentsRepository.validateAppointments(appointments);
    if (validateHorus) {
      throw new NotFoundException('No hay disponibilidad para esa franja');
    }

    // ✅ Crear turno
    return await this.appointmentsRepository.createAppointment(appointments);
  }
}
