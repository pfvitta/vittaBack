import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidad para gestión de recuperación de contraseñas
 * Almacena tokens temporales para restablecimiento de credenciales
 */

@Entity({
  name: 'recoverPasswords',
})
export class RecoverPassword {
  // ID único de la recuperacion de contraseña
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del usuario que solicita la recuperacion de contraseñaa
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  // Token único (válido para un solo uso)
  @Column({ type: 'varchar', length: 200, nullable: false })
  token: string;

  // Fecha de vencimiento del token
  @Column({ type: 'date', nullable: false })
  expiration: Date;

  // Estado de uso (false=válido, true=ya utilizado)
  @Column({ type: 'boolean' })
  used: boolean;
}
