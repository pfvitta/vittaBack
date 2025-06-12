import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Registro de pagos asociados a membresías
 * Almacena información transaccional de suscripciones
 */

@Entity({
  name: 'membershipPayments',
})
export class MembershipPayment {
  // ID único de la transacción
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID de la membresía
  @Column({ type: 'uuid', nullable: false })
  membershipId: string;

  // Valor pagado por la membresía
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  // Fecha en que se registró el pago
  @CreateDateColumn()
  paymentDate: Date;

  // Método utilizado para el pago
  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  paymentMethod: string;
}
