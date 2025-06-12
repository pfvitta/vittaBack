import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entidad para suscriptores de newsletter
 * Registra correos electrónicos para envío de boletines informativos
 */

@Entity({
  name: 'newsletters',
})
export class Newsletter {
  // ID único autogenerado
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Email del suscriptor (único en el sistema)
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  // Fecha-hora de suscripción, se registra automáticamente
  @CreateDateColumn()
  subscriptionDate: Date;
}
