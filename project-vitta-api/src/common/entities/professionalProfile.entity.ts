import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // ID del usuario relacionado 
  @Column({ type: 'uuid', nullable: false })
  usuarioId: string;

  // Biografía del profesional
  @Column({ type: 'text', nullable: false })
  biografia: string;

  // ¿Fue validado manualmente?
  @Column({ type: 'boolean', default: false })
  validado: boolean;

  // ID  del validador (admin)
  @Column({ type: 'uuid', nullable: false })
  verificadoPor: string;

  // Experiencia profesional (texto libre)
  @Column({ type: 'text', nullable: false })
  experiencia: string;

  // Precio por consulta (guardado como número)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  precioConsulta: number;

  // URL frontal de la tarjeta profesional
  @Column({ type: 'varchar', nullable: false })
  tarjetaProfesionalFrontalUrl: string;

  // URL trasera de la tarjeta profesional
  @Column({ type: 'varchar', nullable: false })
  tarjetaProfesionalTraseraUrl: string;
}
