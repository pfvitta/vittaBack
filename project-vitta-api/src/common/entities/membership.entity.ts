import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

/**
 * Entidad que gestiona las membresías de pacientes
 * Registra suscripciones con sus características y vigencia
 */

@Entity({ name: 'memberships' })
export class Membership {
  // ID único de la membresía
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.membership)
  @JoinColumn()
  user: User;

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
  price: number;
}
