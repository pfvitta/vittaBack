import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'memberships' })
export class Membership {
  // ID único de la membresía
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del paciente que adquiere la membresía
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  // Tipo de membresía (ej: 'mensual', 'premium')
  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  // Estado actual (ej: 'activa', 'vencida')
  @Column({ type: 'varchar', length: 10, nullable: false })
  status: string;

  // Fecha de inicio de la membresía
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  // Fecha de finalización de la membresía
  @Column({ type: 'date', nullable: false })
  endDate: Date;

  // Valor pagado por la membresía
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;
}
