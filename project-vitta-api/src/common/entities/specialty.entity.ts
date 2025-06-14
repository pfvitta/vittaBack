import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

/**
 * Entidad para especialidades médicas/profesionales
 * Registra las diferentes áreas de especialización disponibles
 */

@Entity({
  name: 'specialties',
})
export class Specialty {
  // ID generado automáticamente en formato UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre de la especialidad
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.specialty)
  @JoinColumn()
  user: User;
}
