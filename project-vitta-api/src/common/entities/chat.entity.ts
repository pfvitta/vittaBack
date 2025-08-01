import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Registro de conversación entre paciente y profesional
 * Almacena los metadatos básicos de cada chat creado
 */

@Entity({ name: 'chats' })
export class Chat {
  // ID único del chat
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del paciente que participa en el chat
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  // ID del profesional que participa en el chat
  @Column({ type: 'uuid', nullable: false })
  professionalId: string;

  // Fecha de creación del chat (generada automáticamente)
  @CreateDateColumn()
  createdAt: Date;
}
