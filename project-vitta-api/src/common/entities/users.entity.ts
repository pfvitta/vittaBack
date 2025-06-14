import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Membership } from './membership.entity';
import { ProfessionalProfile } from './professionalProfile.entity';
import { Specialty } from './specialty.entity';

/**
 * Entidad para usuarios del sistema
 * Contiene información personal, credenciales y documentos de identificación
 */

@Entity({
  name: 'users',
})
export class User {
  // ID generado automáticamente en formato UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre completo del usuario
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // Correo electrónico único
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  // Contraseña hasheada (bcrypt genera hasta 60 caracteres)
  @Column({ type: 'varchar', length: 180, nullable: false })
  password: string;

  // Numero de teléfono celular
  @Column({ length: 15, nullable: false })
  phone: string;

  // Número de documento único
  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  dni: string;

  // Ciudad de residencia
  @Column({ type: 'varchar', length: 50, nullable: false })
  city: string;

  // Fecha de nacimiento del usuario
  @Column({ type: 'date', nullable: false })
  dob: Date;

  // Estado del usuario (activo o inactivo)
  @Column({ type: 'varchar', length: 8, nullable: false, default: 'activo' })
  status: string;

  // Fecha de creación del registro (generado automáticamente)
  @CreateDateColumn()
  createAt: Date;

  // Rol del usuario (ej: admin, profesional, user)
  @Column({ type: 'varchar', length: 11, nullable: false })
  role: string;

  @OneToOne(() => Membership, (membership) => membership.user)
  membership: Membership;

  @OneToOne(
    () => ProfessionalProfile,
    (professionalProfile) => professionalProfile.user,
  )
  professionalProfile: ProfessionalProfile;

  @OneToMany(() => Specialty, (specialty) => specialty.user)
  specialty: Specialty[];
}
