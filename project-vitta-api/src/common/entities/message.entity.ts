import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entidad para mensajes de chat
 * Almacena el contenido y metadatos de los mensajes enviados
 */

@Entity({
  name: 'messages',
})
export class Message {
  // ID único de la notificacion
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del chat
  @Column({ type: 'uuid', nullable: false })
  chatId: string;

  // ID del usuario remitente
  @Column({ type: 'uuid', nullable: false })
  senderId: string;

  // Contenido textual del mensaje
  @Column({ type: 'text', nullable: false })
  content: string;

  // Estado de lectura (false=no leído, true=leído)
  @Column({ type: 'boolean', nullable: false, default: false })
  leidsa: boolean;

  // Fecha-hora de envío del mensaje
  @CreateDateColumn()
  sentIn: Date;
}
