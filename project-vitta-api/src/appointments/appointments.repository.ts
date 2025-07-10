import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../common/entities/appointment.entity';
import { Between, Repository } from 'typeorm';
import { CreateAppointmentDto } from '../common/dtos/createAppointment.dto';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async userShiftHistory(id: string) {
    return this.appointmentRepository.find({
      where: { id },
    });
  }

  async providerShiftHistory(id: string) {
    return this.appointmentRepository.find({
      where: { id },
    });
  }

  async validateAppointmentProfessional(provider: ValidateAppointmentDto) {
    return await this.appointmentRepository.find({
      where: { professionalId: provider.professionalId, date: provider.date },
    });
  }

  async validateUserShiftAssignment(rango: {
    userId: string;
    inicio: Date;
    fin: Date;
  }) {
    return await this.appointmentRepository.find({
      where: { userId: rango.userId, date: Between(rango.inicio, rango.fin) },
    });
  }

  async validateAppointments(appointments: CreateAppointmentDto) {
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

  async createAppointment(appointments: CreateAppointmentDto) {
    return await this.appointmentRepository.save(appointments);
  }
}
