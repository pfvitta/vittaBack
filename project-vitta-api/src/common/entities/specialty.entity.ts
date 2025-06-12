import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // Descripción detallada de la especialidad
  @Column({ type: 'text', nullable: false })
  description: string;
}
