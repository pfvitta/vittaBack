// src/common/entities/messages.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './users.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}
