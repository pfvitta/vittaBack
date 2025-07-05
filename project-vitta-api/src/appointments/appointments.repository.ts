import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../common/entities/appointment.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../common/dtos/createAppointment.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * Verifica si un profesional tiene un turno agendado en una fecha específica.
   * @param provider - Objeto con el ID del profesional y la fecha a consultar.
   * @returns Lista de turnos encontrados para ese profesional en esa fecha.
   */
  async validateAppointmentProfessional(provider: {
    professionalId: string;
    date: Date;
  }) {
    return await this.appointmentRepository.find({
      where: { professionalId: provider.professionalId, date: provider.date },
    });
  }

  /**
   * Valida si un turno específico ya existe con base en todos sus datos.
   * @param appointments - DTO con los datos completos del turno a validar.
   * @returns El turno encontrado, si existe.
   */
  async validateAppointment(appointments: CreateAppointmentDto) {
    return await this.appointmentRepository.findOne({
      where: {
        userId: appointments.userId,
        professionalId: appointments.professionalId,
        date: appointments.date,
        time: appointments.time,
        status: appointments.status,
      },
    });
  }

  /**
   * Crea un nuevo turno con los datos proporcionados.
   * @param appointments - DTO con los datos necesarios para crear el turno.
   * @returns El turno creado.
   */
  async;
  async createAppointment(appointments: CreateAppointmentDto) {
    return await this.appointmentRepository.save(appointments);
  }
}
