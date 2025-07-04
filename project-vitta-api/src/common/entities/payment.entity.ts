import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../entities/users.entity';

export type PaymentMethod = 'paypal' | 'stripe';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  paypalOrderId?: string; // solo aplica a PayPal

  @Column({ type: 'varchar', nullable: true })
  captureId?: string; // solo aplica a PayPal

  @Column({ type: 'varchar', nullable: true })
  stripePaymentIntentId?: string | null; // solo aplica a Stripe

  @Column()
  payerEmail: string;

  @Column()
  amount: string;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column()
  paymentMethod: string; // 'paypal' | 'stripe'

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
