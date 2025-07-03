import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfessionalProfile } from './professionalProfile.entity';

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

  // @ManyToOne(
  //   () => ProfessionalProfile,
  //   (professionalProfile) => professionalProfile.specialty,
  // )
  // @JoinColumn()
  // professionalProfile: ProfessionalProfile;

  @ManyToMany(() => ProfessionalProfile, (profile) => profile.specialty)
  professionalProfiles: ProfessionalProfile[];
}
