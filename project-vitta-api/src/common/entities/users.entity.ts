import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
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

  // Rol del usuario (ej: admin, nutricionista, user)
  @Column({ type: 'varchar', length: 11, nullable: false })
  rol: string;

  // Tipo de documento (ej: CC, CE, TI)
  @Column({ type: 'varchar', length: 10, nullable: false })
  tipoDocumento: string;

  // Número de documento único
  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  numeroDocumento: string;

  // URL de la imagen del frente del documento
  @Column({ type: 'varchar', nullable: false })
  documentoFrontalUrl: string;

  // URL de la imagen del reverso del documento
  @Column({ type: 'varchar', nullable: false })
  documentoTraseroUrl: string;

  // Ciudad o lugar donde se expidió el documento
  @Column({ type: 'varchar', length: 40, nullable: false })
  lugarExpedicion: string;

  // Fecha de nacimiento del usuario
  @Column({ type: 'date', nullable: false })
  fechaNacimiento: Date;

  // Estado del usuario (activo o no)
  @Column({ type: 'boolean', nullable: false })
  activo: boolean;

  // Fecha de creación del registro (generado automáticamente)
  @CreateDateColumn()
  creadoEn: Date;
}
