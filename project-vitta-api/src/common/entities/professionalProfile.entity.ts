import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Specialty } from './specialty.entity';

@Entity({
  name: 'professional_profiles',
})

/**
 * Perfil profesional de usuarios del sistema
 * Contiene información de validación y credenciales profesionales
 */
export class ProfessionalProfile {
  // ID único autogenerado
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.professionalProfile)
  @JoinColumn()
  user: User;

  // Biografía del profesional
  @Column({ type: 'text', nullable: false })
  biography: string;

  // Validacion de documentos
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  // ID del validador (admin)
  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  // Experiencia profesional (texto libre)
  @Column({ type: 'text', nullable: false })
  experience: string;

  // numero de la tarjeta profesional
  @Column({ type: 'varchar', nullable: false })
  licenseNumber: string;

  // @OneToMany(() => Specialty, (specialty) => specialty.professionalProfile, {
  //   cascade: true,
  // })
  // specialty: Specialty[];

  @ManyToMany(() => Specialty, { cascade: true })
  @JoinTable() // Este decorador crea la tabla intermedia
  specialty: Specialty[];
}
