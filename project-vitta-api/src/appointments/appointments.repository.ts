import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../common/entities/appointment.entity';
import { Between, Repository } from 'typeorm';
import { CreateAppointmentDto } from '../common/dtos/createAppointment.dto';
import { ValidateAppointmentDto } from '../common/dtos/validateAppointment.dto';
import { format } from 'date-fns';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(ProfessionalProfile)
    private professionalProfileRepository: Repository<ProfessionalProfile>,
  ) {}

  async userShiftHistory(userId: string) {
    return this.appointmentRepository.find({
      where: { userId },
      relations: ['professional', 'professional.user'],
    });
  }

  async providerShiftHistory(professionalId: string) {
    return this.appointmentRepository.find({
      where: { professionalId: professionalId },
      relations: ['user'],
    });
  }

  async validateAppointmentProfessional(provider: ValidateAppointmentDto) {
    console.log('validateAppointmentProfessional', provider);
    return await this.appointmentRepository.find({
      where: { professionalId: provider.professionalId, date: provider.date },
    });
  }

  async cambioIdProfessional(provider: ValidateAppointmentDto) {
    return await this.professionalProfileRepository.findOne({
      where: { user: { id: provider.professionalId } },
      relations: ['user'],
    });
  }

  async validateUserShiftAssignment(rango: {
    userId: string;
    inicio: Date;
    fin: Date;
  }) {
    const inicioStr = format(rango.inicio, 'yyyy-MM-dd');
    const finStr = format(rango.fin, 'yyyy-MM-dd');

    return await this.appointmentRepository.find({
      where: {
        userId: rango.userId,
        date: Between(inicioStr, finStr), // ✅ ahora sí es Between<string, string>
        status: 'confirmed',
      },
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

  async validate(id: string) {
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async updateStatus(appt: Appointment) {
    return await this.appointmentRepository.update(appt.id, {
      status: appt.status,
    });
  }
}
