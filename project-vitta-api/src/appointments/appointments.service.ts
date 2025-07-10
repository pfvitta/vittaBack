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
   * Consulta el historial de turnos agendados por un usuario.
   *
   * @param id - ID del usuario (UUID).
   * @throws NotFoundException si no tiene turnos registrados.
   * @returns Lista de turnos asociados al usuario.
   */
  async userShiftHistory(id: string) {
    const shiftValidation =
      await this.appointmentsRepository.userShiftHistory(id);

    if (!shiftValidation || shiftValidation.length === 0) {
      throw new NotFoundException(
        'No se encontraron turnos para este usuario.',
      );
    }

    return shiftValidation;
  }

  /**
   * Consulta el historial de turnos asignados a un profesional.
   *
   * @param id - ID del profesional (UUID).
   * @throws NotFoundException si no tiene turnos registrados.
   * @returns Lista de turnos asignados al profesional.
   */

  async providerShiftHistory(id: string) {
    const shiftValidation =
      await this.appointmentsRepository.providerShiftHistory(id);

    if (!shiftValidation || shiftValidation.length === 0) {
      throw new NotFoundException(
        'No se encontraron turnos asignados a este profesional.',
      );
    }

    return shiftValidation;
  }

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
   *
   * Reglas de negocio:
   * - No se permite que el usuario sea el mismo profesional.
   * - Solo se permiten turnos de lunes a viernes, entre 08:00 y 17:00.
   * - La hora debe ser una franja horaria permitida (`this.horus`).
   * - No se permite agendar fechas pasadas.
   * - No se permite duplicidad (mismo usuario, profesional, fecha y hora).
   *
   * @param appointments - DTO con los datos del turno.
   * @throws BadRequestException | NotFoundException
   * @returns Turno creado exitosamente.
   */
  async createAppointment(appointments: CreateAppointmentDto) {
    // 🚫 Regla 1: Usuario no puede agendar consigo mismo
    if (appointments.userId === appointments.professionalId) {
      throw new BadRequestException({
        alert: 'Asignación inválida',
        errors: [
          {
            field: 'userId',
            message: 'El usuario no puede agendar un turno consigo mismo.',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    // 📅 Procesar fechas
    const fecha = new Date(appointments.date);
    const hoy = new Date();

    const fechaSinHora = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );
    const hoySinHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    );

    // 🚫 Regla 2: No se permiten fines de semana ni fuera del horario laboral

    const dia = fecha.getDay(); // Domingo: 0, Sábado: 6

    const hora = appointments.time.trim(); // limpia espacios
    const [hh, mm] = hora.split(':').map(Number);
    const minutos = hh * 60 + mm;

    const HORA_INICIO = 480; // 08:00
    const HORA_FIN = 1020; // 17:00

    if (
      minutos < HORA_INICIO ||
      minutos > HORA_FIN ||
      dia === 0 ||
      dia === 6 ||
      fechaSinHora < hoySinHora
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
      });
    }

    // 🚫 Regla 3: Validar franja horaria permitida
    const isHoraValida = this.horus.some(
      (h) => h.hourHand === appointments.time,
    );

    if (!isHoraValida) {
      throw new BadRequestException({
        alert: 'Hora inválida',
        errors: [
          { field: 'time', message: 'La hora no es una franja permitida' },
        ],
      });
    }

    appointments.date = fechaSinHora;

    // 🚫 Regla 4: Verificar duplicidad del turno
    const validateHorus =
      await this.appointmentsRepository.validateAppointments(appointments);
    if (validateHorus) {
      throw new NotFoundException('No hay disponibilidad para esa franja');
    }

    const inicioMes = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      1,
      0,
      0,
      0,
    );

    const inicioMesSinHora = new Date(
      inicioMes.getFullYear(),
      inicioMes.getMonth(),
      inicioMes.getDate(),
    );

    const finMes = new Date(
      fecha.getFullYear(),
      fecha.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const finMesSinHora = new Date(
      finMes.getFullYear(),
      finMes.getMonth(),
      finMes.getDate(),
    );

    const createdatosvalidacionturno = {
      userId: appointments.userId,
      inicio: inicioMesSinHora,
      fin: finMesSinHora,
    };

    const cantidadTurnosMes =
      await this.appointmentsRepository.validateUserShiftAssignment(
        createdatosvalidacionturno,
      );

    const turnosValidos = cantidadTurnosMes.filter((turno) =>
      ['pending', 'confirmed', 'completed'].includes(turno.status),
    );

    if (turnosValidos.length >= 2) {
      throw new NotFoundException(
        'Ya completó la totalidad de sus turnos para este mes',
      );
    }

    // ✅ Crear turno
    return await this.appointmentsRepository.createAppointment(appointments);
  }
}
