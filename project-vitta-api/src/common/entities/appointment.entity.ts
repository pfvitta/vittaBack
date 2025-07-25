import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { ProfessionalProfile } from './professionalProfile.entity';

/**
 * Entidad que representa las citas médicas del sistema
 * Registra las reservas de turnos entre pacientes y profesionales
 */

@Entity({ name: 'appointments' })
export class Appointment {
  // ID único del turno
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'userId' }) // 🔥 ahora lo enlaza con userId)
  user: User;

  @ManyToOne(
    () => ProfessionalProfile,
    (professionalProfile) => professionalProfile.appointments,
  )
  @JoinColumn({ name: 'professionalId' }) // 🔥 ahora lo enlaza con professionalId
  professional: ProfessionalProfile;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'professionalId', type: 'uuid' })
  professionalId: string;

  // Fecha agendada del turno
  @Column({ type: 'date', nullable: false })
  date: string;

  // Hora del turno (HH:mm)
  @Column({ type: 'time', nullable: false })
  time: string;

  // Estado actual de la cita: 'pending'|'confirmed'|'cancelled'|'completed'
  @Column({ type: 'varchar', length: 10, default: 'pending' })
  status: string;
}
