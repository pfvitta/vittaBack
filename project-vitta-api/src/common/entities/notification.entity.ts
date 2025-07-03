import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entidad para el manejo de notificaciones del sistema
 * Registra los mensajes y alertas enviadas a los usuarios
 */

@Entity({
  name: 'notifications',
})
export class Notification {
  // ID único de la notificacion
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del usuario
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  // Tipo de evento o notificacion
  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  // Contenido detallado de la notificación
  @Column({ type: 'text', nullable: false })
  message: string;

  // Estado de lectura (false=no leída, true=leída)
  @Column({ type: 'boolean', nullable: false, default: false })
  leidsa: boolean;

  // Fecha de envio
  @CreateDateColumn()
  shippingDate: Date;
}
