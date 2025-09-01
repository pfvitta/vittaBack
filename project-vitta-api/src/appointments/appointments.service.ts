import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from 'src/common/dtos/createAppointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import data from '../../data.json';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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
    console.log('🟢 Fecha recibida (original):', provider.date);

    const fecha = dayjs.tz(provider.date, 'America/Bogota');
    console.log('🕐 Fecha convertida a zona Bogotá:', fecha.format());

    const dia = fecha.day();
    console.log('📆 Día de la semana (0=Domingo, 6=Sábado):', dia);

    // 🎯 Extraer solo la parte YYYY-MM-DD
    const fechaFormateada = fecha.format('YYYY-MM-DD');
    console.log('✅ Fecha formateada solo año-mes-día:', fechaFormateada);

    if (dia === 0 || dia === 6) {
      console.log('❌ Turno en fin de semana, se lanza excepción');
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

    const cambioIdProfessional =
      await this.appointmentsRepository.cambioIdProfessional(provider);
    console.log('🔍 Resultado de cambioIdProfessional:', cambioIdProfessional);

    if (!cambioIdProfessional) {
      console.log('❌ No se encontró profesional con ese ID');
      throw new NotFoundException('No existe un perfil profesional');
    }

    provider.date = fechaFormateada;
    provider.professionalId = cambioIdProfessional.id;

    console.log('📦 Provider listo para validación:', provider);

    const validatedate =
      await this.appointmentsRepository.validateAppointmentProfessional(
        provider,
      );
    console.log('📋 Resultado de validación de turnos:', validatedate);

    if (!validatedate || validatedate.length === 0) {
      console.log('✅ No hay turnos ocupados, se devuelve horario completo');
      return this.horus;
    }

    const horasOcupadas = validatedate.map((turno) => {
      if (turno.time && turno.status !== 'cancelled') {
        return turno.time;
      }
    });
    console.log('⛔ Horas ocupadas:', horasOcupadas);

    const horasdisponibles = this.horus.filter(
      (hora) => !horasOcupadas.includes(hora.hourHand),
    );
    console.log('✅ Horas disponibles para ese día:', horasdisponibles);

    return horasdisponibles;
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

    appt.status = 'confirmed';
    return await this.appointmentsRepository.updateStatus(appt);
  }
}
