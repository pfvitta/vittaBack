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

  async createAppointment(appointments: CreateAppointmentDto) {
    // ✅ Reglas de validación básicas (puedes extenderlas)
    if (appointments.userId === appointments.professionalId) {
      throw new BadRequestException(
        'El usuario no puede ser su propio profesional.',
      );
    }

    const existing =
      await this.appointmentsRepository.validateAppointments(appointments);
    if (existing) {
      throw new NotFoundException('Ya existe un turno en esa franja horaria.');
    }

    console.log('📝 Turno registrado:', appointments);

    return await this.appointmentsRepository.createAppointment(appointments);
  }

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

  async validateAppointment(provider: ValidateAppointmentDto) {
    const fecha = new Date(provider.date);

    // 🚫 Validación: No se permiten turnos fuera del horario laboral ni fines de semana
    const dia = fecha.getDay(); // Domingo: 0, Sábado: 6

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
      });
    }

    const formatteddate = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );

    provider.date = formatteddate;

    const validatedate =
      await this.appointmentsRepository.validateAppointmentProfessional(
        provider,
      );

    if (!validatedate || validatedate.length === 0) {
      return this.horus;
    }

    const horasOcupadas = validatedate.map((turno) => turno.time);

    return this.horus.filter((hora) => !horasOcupadas.includes(hora.hourHand));
  }

  async cancelAppointment(id: string) {
    const appt = await this.appointmentsRepository.validate(id);
    if (!appt) throw new NotFoundException('Turno no encontrado');

    appt.status = 'cancelled';
    return await this.appointmentsRepository.updateStatus(appt);
  }

  async confirmAppointment(id: string) {
    const appt = await this.appointmentsRepository.validate(id);
    if (!appt) throw new NotFoundException('Turno no encontrado');

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
     appt.status = 'confirmed';
    return await this.appointmentsRepository.updateStatus(appt);
  }
}
