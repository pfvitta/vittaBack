// payment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../entities/users.entity'; 

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paypalOrderId: string;

  @Column()
  captureId: string;

  @Column()
  payerEmail: string;

  @Column()
  amount: string;

  @Column()
  currency: string;

  @Column()
  status: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
