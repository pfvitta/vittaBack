import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'newsletters',
})
export class Newsletter {
  // ID único autogenerado
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Correo electrónico único
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  // Fecha y hora de suscripción, se registra automáticamente
  @CreateDateColumn()
  subscriptionDate: Date;
}
