import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'admin',
})
export class Admin {
  // ID generado automáticamente en formato UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre completo del usuario
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // Correo electrónico único
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  // Contraseña hasheada (bcrypt genera hasta 60 caracteres)
  @Column({ type: 'varchar', length: 180, nullable: false })
  password: string;
}
