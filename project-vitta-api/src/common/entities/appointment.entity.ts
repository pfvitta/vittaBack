import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidad que representa las citas médicas del sistema
 * Registra las reservas de turnos entre pacientes y profesionales
 */

@Entity({ name: 'appointments' })
export class Appointment {
  // ID único del turno
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del paciente que solicita el turno
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  // ID del profesional que atiende el turno
  @Column({ type: 'uuid', nullable: false })
  professionalId: string;

  // Fecha agendada del turno
  @Column({ type: 'date', nullable: false })
  date: Date;

  // Hora del turno (HH:mm)
  @Column({ type: 'time', nullable: false })
  time: string;

  // Estado actual de la cita: 'pending'|'confirmed'|'cancelled'|'completed'
  @Column({ type: 'varchar', length: 10 })
  status: string;
}
