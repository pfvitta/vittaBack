import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'appointments' }) // nombre en snake_case, plural
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

  // Hora agendada del turno (como string en formato HH:mm)
  @Column({ type: 'time', nullable: false })
  time: string;

  // Estado del turno (ej: 'pendiente', 'confirmado', 'cancelado')
  @Column({ type: 'varchar', length: 10 })
  status: string;
}
